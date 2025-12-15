import { Workout, Diet } from '@/lib/types'

export const generateWorkoutPDF = (workout: Workout, personalName: string) => {
  const content = `
TREINO: ${workout.title}
----------------------------------------
Aluno: ${workout.clientName || 'N/A'}
Personal: ${personalName}
Data de Criação: ${new Date(workout.createdAt).toLocaleDateString()}
Validade: ${workout.isLifetime ? 'Vitalício' : workout.expirationDate}
----------------------------------------

EXERCÍCIOS:

${workout.exercises
  .map(
    (ex, index) =>
      `${index + 1}. ${ex.name}\n   Séries: ${ex.sets} | Repetições: ${ex.reps}`,
  )
  .join('\n\n')}

----------------------------------------
Gerado por Meu Personal App
  `.trim()

  downloadFile(content, `Treino - ${workout.title}.txt`)
}

export const generateDietPDF = (diet: Diet, personalName: string) => {
  const content = `
DIETA: ${diet.title}
----------------------------------------
Aluno: ${diet.clientName || 'N/A'}
Personal: ${personalName}
Calorias: ${diet.calories} kcal
Validade: ${diet.isLifetime ? 'Vitalício' : diet.expirationDate}
----------------------------------------

REFEIÇÕES:

${diet.meals
  .map(
    (meal, index) =>
      `${index + 1}. ${meal.name}\n   ${meal.items.map((item) => `- ${item}`).join('\n   ')}`,
  )
  .join('\n\n')}

----------------------------------------
Gerado por Meu Personal App
  `.trim()

  downloadFile(content, `Dieta - ${diet.title}.txt`)
}

const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
