import { Workout, Diet, UserProfile, Transaction, Proposal } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const THEME_COLORS: Record<string, string> = {
  blue: '#2563eb',
  green: '#059669',
  orange: '#f97316',
  purple: '#7c3aed',
  red: '#dc2626',
}

const ICONS = {
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  dumbbell: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  dollar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
}

const getBaseStyles = (primaryColor: string) => `
  :root {
    --primary: ${primaryColor};
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-800: #1f2937;
    --gray-900: #111827;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: var(--gray-800);
    margin: 0;
    padding: 0;
    background: #fff;
  }
  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background: white;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; padding: 20px; margin: 0; }
  }
  
  /* Typography */
  h1, h2, h3, h4 { margin: 0; color: var(--gray-900); }
  p { margin: 0; }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 3px solid var(--primary);
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  .brand-area { display: flex; flex-direction: column; gap: 4px; }
  .brand-name { font-size: 24px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: -0.5px; }
  .doc-type { font-size: 14px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 1px; }
  
  .meta-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 24px;
    text-align: right;
  }
  .meta-row { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
  .meta-label { font-size: 11px; text-transform: uppercase; color: var(--gray-500); font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .meta-value { font-size: 14px; font-weight: 500; color: var(--gray-900); }

  /* Section */
  .section { margin-bottom: 35px; }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--primary);
    border-bottom: 1px solid var(--gray-200);
    padding-bottom: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
  }
  .section-title svg { color: var(--primary); opacity: 0.8; }
  
  /* Info Cards */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  .info-card {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 15px;
  }
  .info-label { font-size: 12px; color: var(--gray-500); font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
  .info-value { font-size: 15px; font-weight: 500; color: var(--gray-900); }
  
  /* Content Cards */
  .card-grid { display: flex; flex-direction: column; gap: 15px; }
  .card {
    background: #fff;
    border: 1px solid var(--gray-200);
    border-radius: 10px;
    overflow: hidden;
    page-break-inside: avoid;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .card-header {
    background: var(--gray-50);
    padding: 12px 15px;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-title { font-weight: 700; font-size: 16px; color: var(--gray-900); }
  .card-subtitle { font-size: 13px; color: var(--gray-500); font-weight: 500; }
  
  .card-body { padding: 15px; }
  
  /* Stats Grid inside Card */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 10px;
  }
  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: var(--gray-50);
    padding: 8px;
    border-radius: 6px;
  }
  .stat-label { font-size: 10px; text-transform: uppercase; color: var(--gray-500); font-weight: 700; margin-bottom: 2px; }
  .stat-value { font-size: 14px; font-weight: 600; color: var(--gray-900); }
  
  .notes-box {
    margin-top: 10px;
    font-size: 13px;
    color: var(--gray-600);
    font-style: italic;
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid var(--gray-200);
  }

  /* Table style for Diet items */
  .items-table { w-full; width: 100%; border-collapse: collapse; font-size: 14px; }
  .items-table th { text-align: left; color: var(--gray-500); font-weight: 600; font-size: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--gray-200); }
  .items-table td { padding: 8px 0; border-bottom: 1px solid var(--gray-100); color: var(--gray-800); }
  .items-table tr:last-child td { border-bottom: none; }

  /* Financial Specific */
  .status-badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .status-paid { background: #dcfce7; color: #166534; }
  .status-pending { background: #f3f4f6; color: #374151; }
  .status-overdue { background: #fee2e2; color: #991b1b; }
  .status-cancelled { background: #f3f4f6; color: #9ca3af; text-decoration: line-through; }
  
  /* Footer */
  .footer {
    margin-top: 60px;
    border-top: 1px solid var(--gray-200);
    padding-top: 25px;
    text-align: center;
    page-break-inside: avoid;
  }
  .footer-name { font-weight: 700; color: var(--gray-900); font-size: 16px; margin-bottom: 5px; }
  .footer-contact { display: flex; justify-content: center; gap: 20px; font-size: 14px; color: var(--gray-600); margin-bottom: 15px; align-items: center; }
  .contact-item { display: flex; align-items: center; gap: 6px; }
  .footer-quote { font-size: 13px; color: var(--gray-500); font-style: italic; }
`

const printHTML = (title: string, content: string, primaryColor: string) => {
  const printWindow = window.open('', '', 'width=900,height=800')
  if (!printWindow) {
    alert('Por favor, permita popups para gerar o PDF.')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        ${getBaseStyles(primaryColor)}
      </style>
    </head>
    <body>
      <div class="page">
        ${content}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

export const generateWorkoutPDF = (
  workout: Workout,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor = THEME_COLORS[themeColor] || THEME_COLORS['blue']

  const content = `
    <header class="header">
      <div class="brand-area">
        <div class="brand-name">${profile.name}</div>
        <div class="doc-type">Plano de Treino</div>
      </div>
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">${ICONS.user} Aluno</span>
          <span class="meta-value">${workout.clientName || 'N/A'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.calendar} Data</span>
          <span class="meta-value">${new Date(workout.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.clock} Validade</span>
          <span class="meta-value">${workout.isLifetime ? 'Vitalício' : workout.expirationDate ? new Date(workout.expirationDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
        </div>
      </div>
    </header>

    <div class="section">
      <div class="section-title">Informações Gerais</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Objetivo</div>
          <div class="info-value">${workout.objective || '-'}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Nível</div>
          <div class="info-value">${workout.level || '-'}</div>
        </div>
        ${
          workout.observations
            ? `
        <div class="info-card" style="grid-column: 1 / -1;">
          <div class="info-label">Observações</div>
          <div class="info-value">${workout.observations}</div>
        </div>
        `
            : ''
        }
      </div>
    </div>

    <div class="section">
      <div class="section-title">${ICONS.dumbbell} Estrutura do Treino</div>
      <div class="card-grid">
        ${workout.exercises
          .map(
            (ex, i) => `
          <div class="card">
            <div class="card-header">
              <span class="card-title">${i + 1}. ${ex.name}</span>
            </div>
            <div class="card-body">
              <div class="stats-row">
                <div class="stat-box">
                  <span class="stat-label">Séries</span>
                  <span class="stat-value">${ex.sets}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Repetições</span>
                  <span class="stat-value">${ex.reps}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Carga</span>
                  <span class="stat-value">${ex.weight || '-'}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Descanso</span>
                  <span class="stat-value">${ex.rest || '-'}</span>
                </div>
              </div>
              ${ex.notes ? `<div class="notes-box">Obs: ${ex.notes}</div>` : ''}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Recomendações</div>
      <p style="font-size: 14px; color: var(--gray-600); line-height: 1.6;">
        Lembre-se de respeitar o tempo de descanso entre as séries. Mantenha-se hidratado durante todo o treino.
        Em caso de desconforto ou dor incomum, interrompa o exercício imediatamente. Consulte seu Personal Trainer para ajustes.
      </p>
    </div>

    <footer class="footer">
      <div class="footer-name">${profile.name}</div>
      <div class="footer-contact">
        <span class="contact-item">${ICONS.phone} ${profile.phone}</span>
        <span class="contact-item">${ICONS.mail} ${profile.email}</span>
      </div>
      <div class="footer-quote">"Este plano foi desenvolvido de forma personalizada para você."</div>
    </footer>
  `

  printHTML(`Treino - ${workout.title}`, content, primaryColor)
}

export const generateDietPDF = (
  diet: Diet,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor = THEME_COLORS[themeColor] || THEME_COLORS['blue']

  const content = `
    <header class="header">
      <div class="brand-area">
        <div class="brand-name">${profile.name}</div>
        <div class="doc-type">Plano Alimentar</div>
      </div>
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">${ICONS.user} Aluno</span>
          <span class="meta-value">${diet.clientName || 'N/A'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.calendar} Data</span>
          <span class="meta-value">${new Date(diet.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.clock} Validade</span>
          <span class="meta-value">${diet.isLifetime ? 'Vitalício' : diet.expirationDate ? new Date(diet.expirationDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
        </div>
      </div>
    </header>

    <div class="section">
      <div class="section-title">Informações Gerais</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Objetivo</div>
          <div class="info-value">${diet.objective}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Tipo</div>
          <div class="info-value">${diet.type}</div>
        </div>
        ${
          diet.calories
            ? `
        <div class="info-card">
          <div class="info-label">Calorias (Aprox.)</div>
          <div class="info-value">${diet.calories} kcal</div>
        </div>
        `
            : ''
        }
        ${
          diet.observations
            ? `
        <div class="info-card" style="grid-column: 1 / -1;">
          <div class="info-label">Observações</div>
          <div class="info-value">${diet.observations}</div>
        </div>
        `
            : ''
        }
      </div>
    </div>

    <div class="section">
      <div class="section-title">${ICONS.utensils} Refeições</div>
      <div class="card-grid">
        ${diet.meals
          .map(
            (meal) => `
          <div class="card">
            <div class="card-header">
              <span class="card-title">${meal.name}</span>
              ${meal.time ? `<span class="card-subtitle">${meal.time}</span>` : ''}
            </div>
            <div class="card-body">
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 50%">Alimento</th>
                    <th style="width: 25%">Qtd</th>
                    <th style="width: 25%">Obs</th>
                  </tr>
                </thead>
                <tbody>
                  ${meal.items
                    .map(
                      (item) => `
                    <tr>
                      <td><strong>${item.name}</strong></td>
                      <td>${item.quantity} ${item.unit}</td>
                      <td style="font-size: 12px; color: var(--gray-500);">${item.notes || '-'}</td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Observações Importantes</div>
      <ul style="font-size: 14px; color: var(--gray-600); padding-left: 20px; line-height: 1.6;">
        <li>Beba pelo menos 35ml de água por kg de peso corporal diariamente.</li>
        <li>Evite alimentos ultraprocessados e excesso de açúcar, salvo indicação contrária.</li>
        <li>Siga os horários das refeições conforme sua rotina permite.</li>
        <li>Este plano é individual e intransferível.</li>
      </ul>
    </div>

    <footer class="footer">
      <div class="footer-name">${profile.name}</div>
      <div class="footer-contact">
        <span class="contact-item">${ICONS.phone} ${profile.phone}</span>
        <span class="contact-item">${ICONS.mail} ${profile.email}</span>
      </div>
      <div class="footer-quote">"Este plano foi desenvolvido de forma personalizada para você."</div>
    </footer>
  `

  printHTML(`Dieta - ${diet.title}`, content, primaryColor)
}

export const generateFinancialPDF = (
  transactions: Transaction[],
  profile: UserProfile,
  themeColor: string,
  periodLabel: string,
  metrics: { totalRevenue: number; totalPending: number; totalOverdue: number },
) => {
  const primaryColor = THEME_COLORS[themeColor] || THEME_COLORS['blue']

  const content = `
    <header class="header">
      <div class="brand-area">
        <div class="brand-name">${profile.name}</div>
        <div class="doc-type">Relatório Financeiro</div>
      </div>
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">${ICONS.calendar} Período</span>
          <span class="meta-value">${periodLabel}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.clock} Gerado em</span>
          <span class="meta-value">${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
        </div>
      </div>
    </header>

    <div class="section">
      <div class="section-title">Resumo Financeiro</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Receita Total</div>
          <div class="info-value" style="color: #059669;">R$ ${metrics.totalRevenue.toFixed(2)}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Pendente</div>
          <div class="info-value" style="color: #4b5563;">R$ ${metrics.totalPending.toFixed(2)}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Vencido</div>
          <div class="info-value" style="color: #dc2626;">R$ ${metrics.totalOverdue.toFixed(2)}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${ICONS.dollar} Lista de Pagamentos</div>
      <div class="card">
        <div class="card-body">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 25%">Aluno</th>
                <th style="width: 25%">Descrição</th>
                <th style="width: 15%">Vencimento</th>
                <th style="width: 15%">Valor</th>
                <th style="width: 20%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
                .map(
                  (t) => `
                <tr>
                  <td><strong>${t.studentName || '-'}</strong></td>
                  <td>${t.description}</td>
                  <td>${format(new Date(t.dueDate), 'dd/MM/yyyy')}</td>
                  <td>R$ ${t.amount.toFixed(2)}</td>
                  <td>
                    <span class="status-badge status-${t.status}">
                      ${
                        t.status === 'paid'
                          ? 'Pago'
                          : t.status === 'pending'
                            ? 'Pendente'
                            : t.status === 'overdue'
                              ? 'Vencido'
                              : 'Cancelado'
                      }
                    </span>
                  </td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-name">${profile.name}</div>
      <div class="footer-contact">
        <span class="contact-item">${ICONS.mail} ${profile.email}</span>
      </div>
    </footer>
  `

  printHTML(`Relatório Financeiro - ${periodLabel}`, content, primaryColor)
}

export const generateProposalPDF = (
  proposal: Proposal,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor = THEME_COLORS[themeColor] || THEME_COLORS['blue']

  const content = `
    <header class="header">
      <div class="brand-area">
        <div class="brand-name">${profile.name}</div>
        <div class="doc-type">Proposta Comercial</div>
      </div>
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">${ICONS.user} Para</span>
          <span class="meta-value">${proposal.clientName}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.calendar} Data</span>
          <span class="meta-value">${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">${ICONS.clock} Validade</span>
          <span class="meta-value">30 dias</span>
        </div>
      </div>
    </header>

    <div class="section">
      <div class="section-title">Objetivo e Escopo</div>
      <div class="info-grid">
        <div class="info-card" style="grid-column: 1 / -1;">
          <div class="info-label">Objetivo do Cliente</div>
          <div class="info-value">${proposal.clientObjective}</div>
        </div>
        <div class="info-card" style="grid-column: 1 / -1;">
          <div class="info-label">Descrição do Acompanhamento</div>
          <div class="info-value">${proposal.description}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${ICONS.file} Plano Oferecido</div>
      <div class="card">
        <div class="card-body">
          <div class="stats-row" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-box">
              <span class="stat-label">Plano</span>
              <span class="stat-value">${proposal.planName}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Duração</span>
              <span class="stat-value">${proposal.duration}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Investimento</span>
              <span class="stat-value" style="color: ${primaryColor}">R$ ${proposal.value.toFixed(2)}</span>
            </div>
          </div>
          ${
            proposal.observations
              ? `
            <div class="notes-box">
              <strong>Observações:</strong> ${proposal.observations}
            </div>
          `
              : ''
          }
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Próximos Passos</div>
      <p style="font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 20px;">
        Esta proposta é válida por 30 dias. Para iniciarmos o acompanhamento, entre em contato comigo pelo WhatsApp ou Email.
        Estou à disposição para tirar qualquer dúvida e ajustarmos os detalhes para alcançarmos seus objetivos.
      </p>
      
      <div style="text-align: center; margin-top: 30px;">
        <div style="
          display: inline-block;
          background: #25D366;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          text-decoration: none;
          font-size: 16px;
        ">
          Falar no WhatsApp: ${profile.phone}
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-name">${profile.name}</div>
      <div class="footer-contact">
        <span class="contact-item">${ICONS.phone} ${profile.phone}</span>
        <span class="contact-item">${ICONS.mail} ${profile.email}</span>
      </div>
    </footer>
  `

  printHTML(`Proposta - ${proposal.clientName}`, content, primaryColor)
}
