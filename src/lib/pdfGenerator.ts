import { Workout, Diet } from '@/lib/types'

export const generateWorkoutPDF = (workout: Workout, personalName: string) => {
  const content = `
TREINO: ${workout.title}
----------------------------------------
Aluno: ${workout.clientName || 'N/A'}
Personal: ${personalName}
Data de Criação: ${new Date(workout.createdAt).toLocaleDateString()}
Objetivo: ${workout.objective || 'N/A'}
Nível: ${workout.level || 'N/A'}
Início: ${workout.startDate ? new Date(workout.startDate).toLocaleDateString() : 'N/A'}
Validade: ${workout.isLifetime ? 'Vitalício' : workout.expirationDate ? new Date(workout.expirationDate).toLocaleDateString() : 'N/A'}

Observações Gerais:
${workout.observations || 'Nenhuma'}
----------------------------------------

EXERCÍCIOS:

${workout.exercises
  .map(
    (ex, index) =>
      `${index + 1}. ${ex.name}
   Séries: ${ex.sets} | Repetições: ${ex.reps}
   ${ex.weight ? `Carga: ${ex.weight}` : ''} ${ex.rest ? `| Descanso: ${ex.rest}` : ''}
   ${ex.notes ? `Obs: ${ex.notes}` : ''}`,
  )
  .join('\n\n')}

----------------------------------------
Gerado por Meu Personal App
  `.trim()

  downloadFile(content, `Treino - ${workout.title}.txt`)
}

export const generateDietPDF = (diet: Diet, personalName: string) => {
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    alert('Permita popups para gerar o PDF')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dieta - ${diet.title}</title>
      <style>
        body { font-family: sans-serif; line-height: 1.5; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #111; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 0.9em; }
        .meal { background: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px; page-break-inside: avoid; }
        .meal h3 { margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .item { margin-bottom: 10px; display: flex; justify-content: space-between; }
        .item-details { color: #666; font-size: 0.9em; }
        .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${diet.title}</h1>
        <p><strong>Objetivo:</strong> ${diet.objective} | <strong>Tipo:</strong> ${diet.type}</p>
        <p>${diet.observations || ''}</p>
      </div>
      
      <div class="info">
        <div><strong>Aluno:</strong> ${diet.clientName || 'N/A'}</div>
        <div><strong>Personal:</strong> ${personalName}</div>
        <div><strong>Data:</strong> ${new Date(diet.createdAt).toLocaleDateString()}</div>
        <div><strong>Validade:</strong> ${diet.isLifetime ? 'Vitalício' : diet.expirationDate ? new Date(diet.expirationDate).toLocaleDateString() : 'N/A'}</div>
      </div>

      <h2>Plano Alimentar</h2>
      
      ${diet.meals
        .map(
          (meal) => `
        <div class="meal">
          <h3>${meal.name} ${meal.time ? `<span style="font-weight:normal; font-size:0.8em; color:#666">(${meal.time})</span>` : ''}</h3>
          ${meal.items
            .map(
              (item) => `
            <div class="item">
              <div><strong>${item.name}</strong></div>
              <div>${item.quantity} ${item.unit}</div>
            </div>
            ${item.notes ? `<div class="item-details">Obs: ${item.notes}</div>` : ''}
          `,
            )
            .join('')}
        </div>
      `,
        )
        .join('')}

      <div class="footer">
        <p>Gerado por Meu Personal App</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
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
