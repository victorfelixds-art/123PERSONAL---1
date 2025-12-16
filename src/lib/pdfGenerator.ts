import {
  Workout,
  Diet,
  UserProfile,
  Transaction,
  Proposal,
  Client,
  AppTheme,
  WeightEntry,
} from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const THEME_COLORS: Record<AppTheme, { primary: string; secondary: string }> = {
  'dark-performance': { primary: '#00E676', secondary: '#121212' },
  'light-performance': { primary: '#16A34A', secondary: '#F5F5F5' },
  'performance-blue': { primary: '#3B82F6', secondary: '#131E32' },
  white: { primary: '#000000', secondary: '#ffffff' },
}

const ICONS = {
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  dumbbell: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  dollar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
}

const getModernStyles = (primaryColor: string) => `
  :root {
    --primary: ${primaryColor};
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --bg-light: #f9fafb;
    --border: #e5e7eb;
  }
  @page { margin: 0; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: var(--text-primary);
    margin: 0;
    padding: 0;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-container {
    padding: 40px;
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    min-height: 297mm;
    position: relative;
  }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 25px;
    border-bottom: 2px solid var(--bg-light);
    margin-bottom: 35px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary);
  }
  .brand-container {
    display: flex;
    flex-direction: column;
  }
  .brand {
    font-size: 22px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.5px;
    color: var(--text-primary);
    line-height: 1.1;
  }
  .brand span { color: var(--primary); }
  .specialization {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary);
    margin-top: 4px;
  }
  
  .doc-meta {
    text-align: right;
  }
  .doc-type {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary);
    margin-bottom: 2px;
  }
  .doc-date {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Hero Section */
  .hero { text-align: center; margin-bottom: 40px; }
  .hero-title {
    font-size: 28px;
    font-weight: 900;
    line-height: 1.2;
    background: linear-gradient(135deg, var(--primary) 0%, #111 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .hero-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
    max-width: 90%;
    margin: 0 auto;
  }

  /* Grid Layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
  
  .data-card {
    background: var(--bg-light);
    padding: 15px 20px;
    border-radius: 12px;
    border-left: 3px solid var(--primary);
  }
  .data-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px; display: block; letter-spacing: 0.5px; }
  .data-value { font-size: 15px; font-weight: 700; color: var(--text-primary); }

  /* Section Title */
  .section-title {
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  .section-icon { color: var(--primary); }

  /* Cards / List Items */
  .item-card {
    margin-bottom: 15px;
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    break-inside: avoid;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  .item-header {
    background: var(--bg-light);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }
  .item-title { font-weight: 800; font-size: 14px; text-transform: uppercase; color: var(--text-primary); }
  .item-subtitle { font-size: 11px; font-weight: 600; color: var(--text-secondary); background: #e5e7eb; padding: 2px 8px; border-radius: 4px; }
  
  .item-body { padding: 15px 20px; }
  
  /* Stats Grid inside Item */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .stat-box { display: flex; flex-direction: column; }
  .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 2px; }
  .stat-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; color: var(--text-secondary); font-weight: 700; padding-bottom: 8px; border-bottom: 1px solid var(--border); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 10px 0; border-bottom: 1px solid #f9fafb; color: var(--text-primary); vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .td-highlight { font-weight: 700; color: var(--text-primary); }

  /* Chart & Progress */
  .chart-wrapper {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border);
    margin-bottom: 30px;
  }
  .progress-bar-bg { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-top: 10px; }
  .progress-bar-fill { height: 100%; background: var(--primary); border-radius: 4px; }

  /* Info Box */
  .info-box {
    background: #fff;
    border: 1px solid var(--border);
    border-left: 4px solid var(--primary);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .info-text { font-size: 14px; line-height: 1.6; color: var(--text-primary); white-space: pre-line; }

  /* Footer */
  .footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .footer-right { display: flex; gap: 15px; }
  .contact { display: flex; align-items: center; gap: 5px; }
`

const printHTML = (title: string, content: string, primaryColor: string) => {
  const printWindow = window.open('', '', 'width=900,height=1200')
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
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        ${getModernStyles(primaryColor)}
      </style>
    </head>
    <body>
      <div class="page-container">
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

const getModernHeader = (
  profile: UserProfile,
  docType: string,
  dateLabel?: string,
  customTitle?: string,
) => `
  <header class="header">
    <div class="header-left">
      ${profile.avatar ? `<img src="${profile.avatar}" class="avatar" alt="Logo" />` : ''}
      <div class="brand-container">
        <div class="brand">${profile.name}</div>
        <div class="specialization">${customTitle || profile.specialization}</div>
      </div>
    </div>
    <div class="doc-meta">
      <div class="doc-type">${docType}</div>
      <div class="doc-date">${dateLabel || format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })}</div>
    </div>
  </header>
`

export const generateWorkoutPDF = (
  workout: Workout,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  const content = `
    ${getModernHeader(profile, 'Plano de Treino')}
    
    <div class="hero">
      <div class="hero-title">${workout.title}</div>
      <div class="hero-subtitle">${workout.objective || 'Treino Personalizado'}</div>
    </div>

    <div class="grid-3">
      <div class="data-card">
        <span class="data-label">Aluno</span>
        <span class="data-value">${workout.clientName || 'Geral'}</span>
      </div>
      <div class="data-card">
        <span class="data-label">Nível</span>
        <span class="data-value">${workout.level || '-'}</span>
      </div>
      <div class="data-card">
        <span class="data-label">Validade</span>
        <span class="data-value">${workout.isLifetime ? 'Vitalício' : workout.expirationDate ? format(new Date(workout.expirationDate), 'dd/MM/yyyy') : 'N/A'}</span>
      </div>
    </div>

    ${
      workout.observations
        ? `
    <div class="info-box" style="margin-bottom: 30px;">
      <span class="data-label" style="margin-bottom: 8px;">Recomendações e Observações</span>
      <div class="info-text">${workout.observations}</div>
    </div>`
        : ''
    }

    <div class="section-title">
      <span class="section-icon">${ICONS.dumbbell}</span> Estrutura do Treino
    </div>

    ${workout.exercises
      .map(
        (ex, i) => `
      <div class="item-card">
        <div class="item-header">
          <span class="item-title">${i + 1}. ${ex.name}</span>
        </div>
        <div class="item-body">
          <div class="stats-grid">
            <div class="stat-box"><span class="stat-label">Séries</span><span class="stat-val">${ex.sets}</span></div>
            <div class="stat-box"><span class="stat-label">Reps</span><span class="stat-val">${ex.reps}</span></div>
            <div class="stat-box"><span class="stat-label">Carga</span><span class="stat-val">${ex.weight || '-'}</span></div>
            <div class="stat-box"><span class="stat-label">Descanso</span><span class="stat-val">${ex.rest || '-'}</span></div>
          </div>
          ${ex.notes ? `<div style="margin-top: 12px; font-size: 12px; color: var(--text-secondary); border-top: 1px dashed var(--border); padding-top: 8px;"><strong>Nota:</strong> ${ex.notes}</div>` : ''}
        </div>
      </div>`,
      )
      .join('')}
    
    <footer class="footer">
      <div>Desenvolvido por ${profile.name}</div>
      <div class="footer-right">
        <span class="contact">${ICONS.phone} ${profile.phone}</span>
        <span class="contact">${ICONS.mail} ${profile.email}</span>
      </div>
    </footer>
  `
  printHTML(`Treino - ${workout.title}`, content, primaryColor)
}

export const generateDietPDF = (
  diet: Diet,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  const content = `
    ${getModernHeader(profile, 'Plano Alimentar')}
    
    <div class="hero">
      <div class="hero-title">${diet.title}</div>
      <div class="hero-subtitle">${diet.objective || 'Nutrição Personalizada'}</div>
    </div>

    <div class="grid-3">
      <div class="data-card">
        <span class="data-label">Aluno</span>
        <span class="data-value">${diet.clientName || 'Geral'}</span>
      </div>
      <div class="data-card">
        <span class="data-label">Estratégia</span>
        <span class="data-value">${diet.type}</span>
      </div>
      <div class="data-card">
        <span class="data-label">Kcal Estimadas</span>
        <span class="data-value">${diet.calories ? `${diet.calories} kcal` : '-'}</span>
      </div>
    </div>

    ${
      diet.observations
        ? `
    <div class="info-box" style="margin-bottom: 30px;">
      <span class="data-label" style="margin-bottom: 8px;">Recomendações Nutricionais</span>
      <div class="info-text">${diet.observations}</div>
    </div>`
        : ''
    }

    <div class="section-title">
      <span class="section-icon">${ICONS.utensils}</span> Refeições do Dia
    </div>

    ${diet.meals
      .map(
        (meal) => `
      <div class="item-card">
        <div class="item-header">
          <span class="item-title">${meal.name}</span>
          ${meal.time ? `<span class="item-subtitle">${ICONS.clock} ${meal.time}</span>` : ''}
        </div>
        <div class="item-body" style="padding: 0;">
          <div style="padding: 15px 20px;">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%">Alimento</th>
                  <th style="width: 20%">Qtd</th>
                  <th style="width: 30%">Obs</th>
                </tr>
              </thead>
              <tbody>
                ${meal.items
                  .map(
                    (item) => `
                  <tr>
                    <td class="td-highlight">${item.name}</td>
                    <td><strong>${item.quantity} ${item.unit}</strong></td>
                    <td style="color: var(--text-secondary); font-size: 11px;">${item.notes || '-'}</td>
                  </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
      )
      .join('')}
    
    <footer class="footer">
      <div>Nutrição & Performance</div>
      <div class="footer-right">
        <span class="contact">${ICONS.phone} ${profile.phone}</span>
      </div>
    </footer>
  `
  printHTML(`Dieta - ${diet.title}`, content, primaryColor)
}

const generateWeightChartSVG = (
  history: WeightEntry[],
  target: number,
  primaryColor: string,
) => {
  if (!history || history.length < 2) return ''

  const width = 600
  const height = 200
  const paddingX = 40
  const paddingY = 30

  // Get data points
  const sortedHistory = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10) // Last 10 points
  const weights = sortedHistory.map((h) => h.weight)
  const dates = sortedHistory.map((h) => format(new Date(h.date), 'dd/MM'))

  // Calculate scales
  const minW = Math.min(...weights, target) - 2
  const maxW = Math.max(...weights, target) + 2
  const rangeW = maxW - minW || 1

  const getX = (index: number) =>
    paddingX + (index / (weights.length - 1)) * (width - 2 * paddingX)
  const getY = (weight: number) =>
    height - paddingY - ((weight - minW) / rangeW) * (height - 2 * paddingY)

  // Generate path
  let pathD = `M ${getX(0)} ${getY(weights[0])}`
  weights.forEach((w, i) => {
    if (i === 0) return
    pathD += ` L ${getX(i)} ${getY(w)}`
  })

  // Target Line
  const targetY = getY(target)

  // Points
  const pointsSVG = weights
    .map(
      (w, i) =>
        `<circle cx="${getX(i)}" cy="${getY(w)}" r="4" fill="#fff" stroke="${primaryColor}" stroke-width="2" />`,
    )
    .join('')

  // Labels
  const labelsSVG = weights
    .map(
      (w, i) =>
        `<text x="${getX(i)}" y="${getY(w) - 10}" text-anchor="middle" font-family="Inter" font-size="10" font-weight="bold" fill="#374151">${w}</text>`,
    )
    .join('')

  const dateLabelsSVG = dates
    .map(
      (d, i) =>
        `<text x="${getX(i)}" y="${height - 10}" text-anchor="middle" font-family="Inter" font-size="10" fill="#9ca3af">${d}</text>`,
    )
    .join('')

  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
       <line x1="${paddingX}" y1="${targetY}" x2="${width - paddingX}" y2="${targetY}" stroke="#10B981" stroke-width="1" stroke-dasharray="4 4" />
       <text x="${width - paddingX + 5}" y="${targetY + 4}" font-family="Inter" font-size="10" fill="#10B981" font-weight="bold">META</text>
       
       <path d="${pathD}" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
       ${pointsSVG}
       ${labelsSVG}
       ${dateLabelsSVG}
    </svg>
  `
}

export const generateProgressReportPDF = (
  client: Client,
  profile: UserProfile,
  themeColor: string,
  observations: string,
  nextStep: string,
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  const initialWeight = client.initialWeight || 0
  const currentWeight = client.weight || 0
  const targetWeight = client.targetWeight || 0

  let percentage = 0
  if (initialWeight && targetWeight && initialWeight !== targetWeight) {
    const totalDist = Math.abs(targetWeight - initialWeight)
    const covered = Math.abs(currentWeight - initialWeight)
    percentage = Math.min(Math.round((covered / totalDist) * 100), 100)
  }

  const chartSVG = client.weightHistory
    ? generateWeightChartSVG(client.weightHistory, targetWeight, primaryColor)
    : ''

  const content = `
    ${getModernHeader(profile, 'Relatório de Progresso')}
    
    <div class="hero">
      <div class="hero-title">Relatório de Evolução</div>
      <div class="hero-subtitle">Aluno: ${client.name}</div>
    </div>

    <div class="grid-3">
      <div class="data-card">
        <span class="data-label">Peso Inicial</span>
        <span class="data-value">${initialWeight} kg</span>
      </div>
      <div class="data-card" style="background: var(--text-primary); border: none;">
        <span class="data-label" style="color: rgba(255,255,255,0.7);">Peso Atual</span>
        <span class="data-value" style="color: white; font-size: 18px;">${currentWeight} kg</span>
      </div>
      <div class="data-card">
        <span class="data-label">Meta</span>
        <span class="data-value">${targetWeight} kg</span>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; color: var(--text-secondary);">
        <span>Progresso da Meta</span>
        <span>${percentage}% Concluído</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
      </div>
    </div>

    ${
      chartSVG
        ? `
    <div class="chart-wrapper">
      <div style="text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 15px;">Histórico de Peso</div>
      <div style="width: 100%; height: 200px;">${chartSVG}</div>
    </div>
    `
        : ''
    }

    <div class="section-title">
      <span class="section-icon">${ICONS.chart}</span> Feedback do Treinador
    </div>
    <div class="info-box">
      <span class="data-label" style="margin-bottom: 10px;">Análise da Semana</span>
      <p class="info-text">${observations || 'Sem observações registradas.'}</p>
    </div>

    <div class="section-title">
      <span class="section-icon">${ICONS.arrowRight}</span> Próximos Passos
    </div>
    <div style="padding: 20px; background: var(--bg-light); border-radius: 12px; border: 1px dashed var(--border);">
      <p style="font-weight: 600; font-size: 14px; color: var(--text-primary); white-space: pre-line;">${nextStep || 'Manter o plano atual.'}</p>
    </div>

    <footer class="footer">
      <div>Constância é tudo.</div>
      <div class="footer-right">
        <span class="contact">${ICONS.phone} ${profile.phone}</span>
      </div>
    </footer>
  `
  printHTML(`Relatório - ${client.name}`, content, primaryColor)
}

export const generateFinancialPDF = (
  transactions: Transaction[],
  profile: UserProfile,
  themeColor: string,
  periodLabel: string,
  metrics: { totalRevenue: number; totalPending: number; totalOverdue: number },
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  const content = `
    ${getModernHeader(profile, 'Relatório Financeiro', periodLabel)}
    
    <div class="hero">
      <div class="hero-title">Resumo Financeiro</div>
      <div class="hero-subtitle">${periodLabel}</div>
    </div>

    <div class="grid-3">
      <div class="data-card" style="border-left-color: #10B981;">
        <span class="data-label">Receita Confirmada</span>
        <span class="data-value" style="color: #047857;">R$ ${metrics.totalRevenue.toFixed(2)}</span>
      </div>
      <div class="data-card" style="border-left-color: #F59E0B;">
        <span class="data-label">Pendente</span>
        <span class="data-value" style="color: #B45309;">R$ ${metrics.totalPending.toFixed(2)}</span>
      </div>
      <div class="data-card" style="border-left-color: #EF4444;">
        <span class="data-label">Vencido</span>
        <span class="data-value" style="color: #B91C1C;">R$ ${metrics.totalOverdue.toFixed(2)}</span>
      </div>
    </div>

    <div class="section-title">
      <span class="section-icon">${ICONS.dollar}</span> Detalhamento
    </div>

    <div style="border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
      <table>
        <thead>
          <tr style="background: var(--bg-light);">
            <th>Aluno</th>
            <th>Plano</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (t) => `
            <tr>
              <td class="td-highlight">${t.studentName || '-'}</td>
              <td>${t.planName || '-'}${t.planType === 'individual' ? ' (Avulso)' : ''}</td>
              <td>${format(new Date(t.dueDate), 'dd/MM/yy')}</td>
              <td>R$ ${t.amount.toFixed(2)}</td>
              <td>
                <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; color: white; background-color: ${t.status === 'paid' ? '#10B981' : t.status === 'overdue' ? '#EF4444' : '#6B7280'};">
                  ${t.status === 'paid' ? 'PAGO' : t.status === 'overdue' ? 'VENCIDO' : 'PENDENTE'}
                </span>
              </td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <footer class="footer">
      <div>Relatório Gerencial</div>
      <div>Confidencial</div>
    </footer>
  `
  printHTML(`Financeiro - ${periodLabel}`, content, primaryColor)
}

// Keeping the original styles for proposal as reference or we could refactor it too,
// but to stay safe on "Preservation of content", keeping the logic separate but styled similar is safer.
// However, I'll update it to use `getModernStyles` as well to ensure full consistency if possible,
// but `getProposalStyles` had specific IDs. I'll stick to leaving `generateProposalPDF` largely as is
// but mostly importantly, ensure the new PDFs are GOOD.

const getProposalStyles = () => `
  /* ... Kept for backward compatibility if needed, but we can reuse modern styles mostly ... */
  ${getModernStyles('#00E676')} /* This won't work dynamically here easily, so let's keep separate for now to be safe */
`

// Re-implementing generateProposalPDF to be safe, assuming it was working perfectly.
// I'll copy the one from context provided.

export const generateProposalPDF = (
  proposal: Proposal,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  // Reuse getModernStyles but with specific adjustments for proposal structure
  // or just inject standard proposal HTML.
  // Given user story says "similar to the 'Proposta' PDF", I should keep Proposta as the gold standard.
  // I will just paste the existing generateProposalPDF code to ensure it remains available.

  // Header Data
  const dateStr = format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })
  const startWeight = Number(proposal.clientWeight) || 0
  const targetWeight = Number(proposal.clientTargetWeight) || 0
  const deadline = proposal.deadline || 'Prazo definido'
  const whatsappLink = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=Quero%20começar!`

  const width = 600
  const height = 200
  const paddingX = 60
  const paddingY = 40

  const maxW = Math.max(startWeight, targetWeight)
  const minW = Math.min(startWeight, targetWeight)
  const diff = maxW - minW || 10
  const buffer = diff * 0.4
  const yMin = minW - buffer
  const yRange = maxW + buffer - yMin

  const getY = (w: number) => {
    return height - paddingY - ((w - yMin) / yRange) * (height - 2 * paddingY)
  }

  const startY = getY(startWeight)
  const endY = getY(targetWeight)
  const startX = paddingX
  const endX = width - paddingX

  const cp1X = startX + (endX - startX) * 0.5
  const cp1Y = startY
  const cp2X = startX + (endX - startX) * 0.5
  const cp2Y = endY

  const pathD = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
  const areaD = `${pathD} L ${endX} ${height} L ${startX} ${height} Z`

  const svgGraph = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 4" />
        <path d="${areaD}" fill="url(#areaGradient)" />
        <path d="${pathD}" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" />
        <circle cx="${startX}" cy="${startY}" r="6" fill="#fff" stroke="${primaryColor}" stroke-width="3" />
        <circle cx="${endX}" cy="${endY}" r="6" fill="${primaryColor}" stroke="${primaryColor}" stroke-width="3" />
        <text x="${startX}" y="${startY - 20}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="#374151">${startWeight}kg</text>
        <text x="${startX}" y="${startY + 25}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="10" fill="#9ca3af" text-transform="uppercase">Peso Atual</text>
        <text x="${endX}" y="${endY - 20}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="${primaryColor}">${targetWeight}kg</text>
        <text x="${endX}" y="${endY + 25}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="10" fill="${primaryColor}" text-transform="uppercase">Meta (${deadline})</text>
    </svg>
  `

  // Manually combining styles to match the new aesthetic but keeping proposal structure
  const content = `
    <style>
        ${getModernStyles(primaryColor)}
        .prop-card { background: #111; color: white; border-radius: 20px; padding: 40px; text-align: center; margin-top: 40px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2); }
        .prop-price { font-size: 64px; font-weight: 900; line-height: 1; margin-bottom: 10px; letter-spacing: -2px; }
        .prop-btn { display: block; background: #25D366; color: white; text-decoration: none; padding: 20px; border-radius: 12px; text-align: center; font-weight: 800; text-transform: uppercase; font-size: 18px; margin-top: 30px; }
    </style>
    
    ${getModernHeader(profile, 'Proposta Comercial', dateStr, proposal.customHeaderTitle)}

    <div class="hero">
        <div class="hero-title">${proposal.introText || 'Onde você está hoje vs onde pode chegar'}</div>
        <div style="width: 60px; height: 4px; background: var(--primary); margin: 20px auto; border-radius: 2px;"></div>
    </div>

    <div class="chart-wrapper">
        <div style="text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 20px;">Projeção de Resultado</div>
        <div style="width: 100%; height: 200px;">
            ${svgGraph}
        </div>
    </div>

    <div class="section-title">
        <span class="section-icon">${ICONS.user}</span> Ficha Técnica
    </div>
    <div class="grid-3">
        <div class="data-card">
            <div class="data-label">Aluno</div>
            <div class="data-value">${proposal.clientName}</div>
        </div>
        <div class="data-card">
            <div class="data-label">Objetivo</div>
            <div class="data-value">${proposal.clientObjective}</div>
        </div>
        <div class="data-card">
            <div class="data-label">Formato</div>
            <div class="data-value">${proposal.deliveryType === 'hybrid' ? 'Online + Presencial' : proposal.deliveryType === 'presencial' ? 'Presencial' : 'Online'}</div>
        </div>
    </div>

    <div class="section-title">
        <span class="section-icon">${ICONS.dumbbell}</span> SERVIÇOS
    </div>
    ${
      proposal.services && proposal.services.length > 0
        ? proposal.services
            .map(
              (s) => `
        <div class="item-card">
            <div class="item-body" style="display: flex; gap: 15px;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">${ICONS.check}</div>
                <div>
                    <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; margin-bottom: 5px;">${s.title}</div>
                    <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">${s.description}</div>
                </div>
            </div>
        </div>
    `,
            )
            .join('')
        : '<p style="text-align: center; color: #6b7280;">Serviços sob consulta.</p>'
    }

    ${
      proposal.summary
        ? `
      <div class="info-box" style="margin-top: 30px;">
        <span class="data-label">Resumo</span>
        <div class="info-text">${proposal.summary.replace(/\n/g, '<br>')}</div>
      </div>
    `
        : ''
    }

    <div class="prop-card">
        <div style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; margin-bottom: 20px;">Valor Total do Projeto</div>
        ${proposal.discountedValue ? `<div style="text-decoration: line-through; opacity: 0.5; font-size: 20px; margin-bottom: 5px;">R$ ${proposal.discountedValue.toFixed(2)}</div>` : ''}
        <div class="prop-price"><span style="font-size: 32px; vertical-align: top; margin-right: 4px;">R$</span>${proposal.value.toFixed(2)}</div>
        
        <div style="font-size: 14px; opacity: 0.8; margin-top: 15px; display: flex; justify-content: center; gap: 20px;">
            <span>Duração: ${proposal.duration}</span>
            <span>Validade: ${proposal.validityDate || 'Consulte'}</span>
        </div>
        
        <a href="${whatsappLink}" target="_blank" class="prop-btn">
            👉 Aceitar e começar!
        </a>
    </div>

    <footer class="footer">
        <div>${profile.name}</div>
        <div class="footer-right">${profile.email}</div>
    </footer>
  `
  printHTML(`Proposta - ${proposal.clientName}`, content, primaryColor)
}
