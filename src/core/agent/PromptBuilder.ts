import { AgentNode, AGENTIC_SETS } from '../../data/agents';
import { useCoreStore } from '../../integration/store/coreStore';
import { useTeamStore } from '../../integration/store/teamStore';

export class PromptBuilder {
  /**
   * Builds the system prompt for an agent based on their role and current project context.
   */
  public static buildSystemPrompt(agent: AgentNode, phase: string, brief: string, allAgents: any[]): string {
    const isLead = agent.index === 1;
    const team = allAgents
      .map((a: any) => `[${a.data.index}] ${a.data.name}`)
      .join(', ');

    const objectives = {
      idle: isLead ? 'Habla con [0] para definir el brief, luego set_user_brief.' : 'Espera a que el Lead empiece.',
      working: isLead ? 'Gestiona el tablero. deliver_project cuando todo esté Hecho.' : 'Completa las tareas.',
      done: 'Proyecto finalizado.'
    };

    const tasks = useCoreStore.getState().tasks;
    const board = tasks.length > 0
      ? tasks.map(t => {
          const agentName = allAgents.find((a: any) => a.data.index === t.assignedAgentId)?.data?.name || `Agent ${t.assignedAgentId}`;
          
          const feedbackStr = t.reviewComments 
            ? `\n   >> FEEDBACK DEL USUARIO / REVISIÓN SOLICITADA: "${t.reviewComments}"`
            : '';
            
          const outputStr = (t.status === 'done' && t.output)
            ? `\n   >> FINAL APPROVED WORK:\n   """\n   ${t.output}\n   """` 
            : '';

          return `* [${t.status.toUpperCase()}] ${t.title} (Owner: ${agentName})${feedbackStr}${outputStr}`;
        }).join('\n\n')
      : 'Vacío';

    const selectedTeamId = useTeamStore.getState().selectedAgentSetId;
    const activeTeam = useTeamStore.getState().customSystems.find(s => s.id === selectedTeamId) 
      || AGENTIC_SETS.find(s => s.id === selectedTeamId);
      
    const referenceImages = useCoreStore.getState().referenceImages;
    const hasImages = referenceImages.length > 0 && (activeTeam?.outputType === 'image' || activeTeam?.outputType === 'video');
    
    let modelLimitInfo = '';
    if (activeTeam?.outputType === 'video') {
      if (activeTeam.outputModel?.includes('lite')) {
        modelLimitInfo = ` Nota: El modelo actual (${activeTeam.outputModel}) solo admite 1 imagen de referencia para la animación.`;
      } else {
        modelLimitInfo = ` Nota: El modelo actual (${activeTeam.outputModel}) admite hasta 3 imágenes de referencia para guía de estilo y contenido.`;
      }
    }

    const imageInstruction = hasImages
      ? `\n6. IMÁGENES DE REFERENCIA: El usuario ha proporcionado ${referenceImages.length} imagen(es) de referencia. DEBES usarlas como guía visual para el estilo, el tono y el contenido del proyecto. Tu equipo debe analizarlas para asegurarse de que el ${activeTeam?.outputType} final se alinee con la inspiración.${modelLimitInfo}`
      : '';

    const outputInstruction = activeTeam?.outputType !== 'text'
      ? `\n4. SALIDA DEL EQUIPO: ${activeTeam?.outputType?.toUpperCase()}. Tu salida de 'deliver_project' DEBE ser un PROMPT muy detallado para un modelo generador de ${activeTeam?.outputType} (${activeTeam?.outputModel}).
CRÍTICO: DEBES sintetizar todos los hallazgos de los subagentes, resultados de investigación y cualquier feedback del usuario en este prompt final. NO te limites a repetir el brief inicial.
El modelo de generación espera UN ÚNICO prompt para producir UN ÚNICO ${activeTeam?.outputType}. Sé preciso.`
      : '';

    const pendingReviews = tasks.filter(t => t.assignedAgentId === agent.index && t.reviewComments);
    const reviewContext = pendingReviews.length > 0
      ? `\nREVISION REQUESTED:\n${pendingReviews.map(t => `- [${t.title}] Feedback: ${t.reviewComments}`).join('\n')}`
      : '';

    return `ID: ${agent.name}. Rol: ${agent.description}. Fase: ${phase}.
${brief ? `Brief: ${brief}` : ''}${reviewContext}
Equipo: Usuario (0), ${team}
KANBAN:
${board}
REGLAS:
1. MÁX 30 PALABRAS en el chat. Las salidas sistémicas ('complete_task', 'deliver_project', y los títulos/descripciones de tareas que crees) deben tener MÁS DE 100 PALABRAS. SIN relleno conversacional, introducciones, cierres ni atribución propia ("He hecho..."). Céntrate exclusivamente en datos esenciales y síntesis.
2. Herramientas solo en WORKING (excepto set_user_brief en IDLE).
3. CALIDAD: Si tu nodo tiene 'Human-in-the-loop' activado, tu resultado de 'complete_task' será revisado por el usuario antes de completarse.
4. SIN META-HABLA: Evita "He terminado X", "Aquí está el resultado". Usa el payload de la herramienta para el contenido y el Chat solo para conversación.${outputInstruction}${imageInstruction}
5. IDIOMA: DEBES generar todas las salidas sistémicas (tareas, resultados de 'complete_task' y prompts de 'deliver_project') en el mismo idioma que el 'Brief' o la interacción del usuario. Si la descripción del proyecto está en español, TODO lo que generes debe estar en español.
Objetivo: ${objectives[phase as keyof typeof objectives] || ''}`;
  }
}
