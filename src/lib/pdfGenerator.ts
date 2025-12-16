import {
  Workout,
  Diet,
  UserProfile,
  Transaction,
  Proposal,
  Client,
  AppTheme,
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
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  dollar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
}

const getBaseStyles = (primaryColor: string) => `
  :root {
    --primary: ${primaryColor};
    --text-primary: #111111;
    --text-secondary: #666666;
    --bg-light: #F9FAFB;
    --border: #E5E7EB;
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
    padding: 60px;
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    min-height: 297mm;
  }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
    border-bottom: 3px solid var(--primary);
    padding-bottom: 20px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary);
  }
  .brand-container {
    display: flex;
    flex-direction: column;
  }
  .brand {
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.5px;
    color: var(--text-primary);
    line-height: 1.1;
  }
  .brand span { color: var(--primary); }
  .specialization {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-secondary);
    margin-top: 2px;
  }
  
  .doc-meta {
    text-align: right;
  }
  .doc-type {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary);
    margin-bottom: 4px;
  }
  .doc-date {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Section Styles */
  .section { margin-bottom: 40px; }
  .section-title {
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    border-left: 4px solid var(--primary);
    padding-left: 10px;
  }

  /* Info Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  
  .info-box {
    background: var(--bg-light);
    padding: 15px;
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  .label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px; display: block; letter-spacing: 0.5px; }
  .value { font-size: 15px; font-weight: 600; color: var(--text-primary); }

  /* Card Lists */
  .item-card {
    margin-bottom: 15px;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    break-inside: avoid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .item-header {
    background: #F3F4F6;
    color: var(--text-primary);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }
  .item-title { font-weight: 800; font-size: 15px; text-transform: uppercase; }
  .item-subtitle { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
  
  .item-body { padding: 15px 20px; }
  
  /* Stats Row */
  .stats-row {
    display: flex;
    gap: 30px;
  }
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 2px; }
  .stat-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }

  /* Footer */
  .footer {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--text-secondary);
  }
  .footer-left { font-weight: 700; text-transform: uppercase; }
  .footer-right { display: flex; gap: 20px; }
  .contact { display: flex; align-items: center; gap: 6px; font-weight: 500; }
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
        ${getBaseStyles(primaryColor)}
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
            // window.close();
          }, 500);
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

const getHeader = (
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
    ${getHeader(profile, 'Plano de Treino')}
    <div class="section">
      <div class="grid-2">
        <div class="info-box"><span class="label">Aluno</span><span class="value">${workout.clientName || 'Geral'}</span></div>
        <div class="info-box"><span class="label">Validade</span><span class="value">${workout.isLifetime ? 'VITALÍCIO' : workout.expirationDate ? format(new Date(workout.expirationDate), 'dd/MM/yyyy') : 'N/A'}</span></div>
      </div>
      <div class="grid-2" style="margin-top: 15px;">
        <div class="info-box"><span class="label">Objetivo</span><span class="value">${workout.objective || '-'}</span></div>
        <div class="info-box"><span class="label">Nível</span><span class="value">${workout.level || '-'}</span></div>
      </div>
      ${workout.observations ? `<div class="info-box" style="margin-top: 15px;"><span class="label">Observações Gerais</span><span class="value" style="font-size: 14px; font-weight: 400; white-space: pre-line;">${workout.observations}</span></div>` : ''}
    </div>
    <div class="section">
      <div class="section-title">${ICONS.dumbbell} Estrutura do Treino: ${workout.title}</div>
      ${workout.exercises
        .map(
          (ex, i) => `
        <div class="item-card">
          <div class="item-header"><span class="item-title">${i + 1}. ${ex.name}</span></div>
          <div class="item-body">
            <div class="stats-row">
              <div class="stat"><span class="stat-label">Séries</span><span class="stat-val">${ex.sets}</span></div>
              <div class="stat"><span class="stat-label">Reps</span><span class="stat-val">${ex.reps}</span></div>
              <div class="stat"><span class="stat-label">Carga</span><span class="stat-val">${ex.weight || '-'}</span></div>
              <div class="stat"><span class="stat-label">Descanso</span><span class="stat-val">${ex.rest || '-'}</span></div>
            </div>
            ${ex.notes ? `<div class="notes"><strong>Nota:</strong> ${ex.notes}</div>` : ''}
          </div>
        </div>`,
        )
        .join('')}
    </div>
    <footer class="footer"><div class="footer-left">Personal Trainer Professional</div><div class="footer-right"><span class="contact">${ICONS.phone} ${profile.phone}</span></div></footer>
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
    ${getHeader(profile, 'Plano Alimentar')}
    <div class="section">
      <div class="grid-3">
        <div class="info-box"><span class="label">Aluno</span><span class="value">${diet.clientName || 'Geral'}</span></div>
        <div class="info-box"><span class="label">Tipo</span><span class="value">${diet.type}</span></div>
        <div class="info-box"><span class="label">Kcal Estimadas</span><span class="value">${diet.calories ? `${diet.calories} kcal` : '-'}</span></div>
      </div>
      <div class="info-box" style="margin-top: 15px;"><span class="label">Objetivo</span><span class="value">${diet.objective}</span></div>
      ${diet.observations ? `<div class="info-box" style="margin-top: 15px; background: #fff; border: 1px solid var(--border);"><span class="label">Recomendações</span><p style="margin-top: 5px; font-size: 14px; white-space: pre-line;">${diet.observations}</p></div>` : ''}
    </div>
    <div class="section">
      <div class="section-title">${ICONS.utensils} Refeições: ${diet.title}</div>
      ${diet.meals
        .map(
          (meal) => `
        <div class="item-card">
          <div class="item-header"><span class="item-title">${meal.name}</span><span class="item-subtitle">${meal.time || ''}</span></div>
          <div class="item-body" style="padding: 0;">
            <table>
              <thead><tr><th style="width: 50%">Alimento</th><th style="width: 20%">Qtd</th><th style="width: 30%">Obs</th></tr></thead>
              <tbody>${meal.items.map((item) => `<tr><td>${item.name}</td><td><strong>${item.quantity} ${item.unit}</strong></td><td style="color: var(--text-secondary); font-size: 12px;">${item.notes || '-'}</td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>`,
        )
        .join('')}
    </div>
    <footer class="footer"><div class="footer-left">Nutrição & Performance</div><div class="footer-right"><span class="contact">${ICONS.phone} ${profile.phone}</span></div></footer>
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
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'
  const content = `
    ${getHeader(profile, 'Relatório Financeiro', periodLabel)}
    <div class="section">
      <div class="section-title">Resumo do Período</div>
      <div class="grid-3">
        <div class="info-box" style="border-left: 4px solid #10B981;"><span class="label">Receita Confirmada</span><span class="value" style="color: #047857; font-size: 18px;">R$ ${metrics.totalRevenue.toFixed(2)}</span></div>
        <div class="info-box" style="border-left: 4px solid #F59E0B;"><span class="label">Pendente</span><span class="value" style="color: #B45309; font-size: 18px;">R$ ${metrics.totalPending.toFixed(2)}</span></div>
        <div class="info-box" style="border-left: 4px solid #EF4444;"><span class="label">Vencido</span><span class="value" style="color: #B91C1C; font-size: 18px;">R$ ${metrics.totalOverdue.toFixed(2)}</span></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">${ICONS.dollar} Detalhamento</div>
      <div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
        <table>
          <thead><tr style="background: var(--bg-light);"><th>Aluno</th><th>Plano</th><th>Vencimento</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>${transactions.map((t) => `<tr><td><strong>${t.studentName || '-'}</strong></td><td>${t.planName || '-'}${t.planType === 'individual' ? ' (Avulso)' : ''}</td><td>${format(new Date(t.dueDate), 'dd/MM/yy')}</td><td>R$ ${t.amount.toFixed(2)}</td><td><span style="text-transform: uppercase; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; color: white; background-color: ${t.status === 'paid' ? '#10B981' : t.status === 'overdue' ? '#EF4444' : '#6B7280'};">${t.status === 'paid' ? 'PAGO' : t.status === 'overdue' ? 'VENCIDO' : 'PENDENTE'}</span></td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
    <footer class="footer"><div class="footer-left">Relatório Gerencial</div><div class="footer-right">Confidencial</div></footer>
  `
  printHTML(`Financeiro - ${periodLabel}`, content, primaryColor)
}

export const generateProgressReportPDF = (
  client: Client,
  profile: UserProfile,
  themeColor: string,
  weeklyObservations: string,
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

  const content = `
    ${getHeader(profile, 'Relatório de Progresso')}
    <div class="section">
      <div class="section-title">Resumo do Aluno: ${client.name}</div>
      <div class="grid-3">
        <div class="info-box"><span class="label">Peso Inicial</span><span class="value">${initialWeight} kg</span></div>
        <div class="info-box" style="background: var(--text-primary); border: none;"><span class="label" style="color: rgba(255,255,255,0.7);">Atual</span><span class="value" style="color: white; font-size: 24px;">${currentWeight} kg</span></div>
        <div class="info-box"><span class="label">Meta</span><span class="value">${targetWeight} kg</span></div>
      </div>
      <div style="margin-top: 30px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;"><span>Evolução da Meta</span><span>${percentage}% Concluído</span></div>
        <div class="progress-bg"><div class="progress-fill" style="width: ${percentage}%;"></div></div>
      </div>
    </div>
    <div class="section"><div class="section-title">${ICONS.chart} Feedback do Treinador</div><div class="info-box" style="background: white; border: 1px solid var(--border); border-left: 4px solid var(--primary); padding: 20px;"><span class="label" style="font-size: 12px; margin-bottom: 10px;">Análise da Semana</span><p style="font-size: 15px; line-height: 1.6; color: var(--text-primary); white-space: pre-line;">${weeklyObservations || 'Sem observações registradas.'}</p></div></div>
    <div class="section"><div class="section-title">${ICONS.arrowRight} Próximos Passos</div><div style="padding: 25px; background: var(--bg-light); border-radius: 8px; border: 1px dashed var(--border);"><p style="font-weight: 600; font-size: 15px; color: var(--text-primary); white-space: pre-line;">${nextStep || 'Manter o plano atual.'}</p></div></div>
    <footer class="footer"><div class="footer-left">Constância é tudo.</div><div class="footer-right"><span class="contact">${ICONS.phone} ${profile.phone}</span></div></footer>
  `
  printHTML(`Relatório - ${client.name}`, content, primaryColor)
}

// ----------------------------------------------------------------------
// NEW STANDARDIZED PROPOSAL GENERATOR
// ----------------------------------------------------------------------

const getProposalStyles = () => `
  #proposal-page {
    font-family: 'Inter', sans-serif;
    color: #1f2937;
    line-height: 1.5;
  }
  
  #proposal-page .primary-text { color: var(--primary); }
  
  /* Modern Header */
  #proposal-page .prop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 2px solid #f3f4f6;
    margin-bottom: 40px;
  }
  #proposal-page .prop-brand { font-size: 28px; font-weight: 900; letter-spacing: -1px; line-height: 1; text-transform: uppercase; }
  #proposal-page .prop-sub { font-size: 14px; color: #6b7280; font-weight: 500; margin-top: 4px; letter-spacing: 0.5px; }
  
  /* Hero / Intro */
  #proposal-page .prop-hero {
    text-align: center;
    margin-bottom: 50px;
    padding: 0 20px;
  }
  #proposal-page .prop-hero-title {
    font-size: 32px;
    font-weight: 900;
    line-height: 1.2;
    background: linear-gradient(135deg, var(--primary) 0%, #111 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  
  /* Graph Container */
  #proposal-page .graph-wrapper {
    background: #fff;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 50px;
    position: relative;
    overflow: hidden;
  }
  #proposal-page .graph-title {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #9ca3af;
    margin-bottom: 20px;
  }
  
  /* Data Grid */
  #proposal-page .data-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 50px;
  }
  #proposal-page .data-card {
    background: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid var(--primary);
  }
  #proposal-page .data-label {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    color: #6b7280;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }
  #proposal-page .data-value {
    font-size: 16px;
    font-weight: 700;
    color: #111;
  }

  /* Services */
  #proposal-page .services-list {
    margin-bottom: 50px;
  }
  #proposal-page .service-row {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #f3f4f6;
    transition: all 0.2s;
  }
  #proposal-page .service-icon {
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  /* Investment */
  #proposal-page .investment-card {
    background: #111;
    color: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
    break-inside: avoid;
  }
  #proposal-page .inv-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.6;
    margin-bottom: 20px;
  }
  #proposal-page .inv-price {
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 10px;
    letter-spacing: -2px;
  }
  #proposal-page .inv-price span { font-size: 32px; vertical-align: top; margin-right: 4px; }
  #proposal-page .inv-old {
    text-decoration: line-through;
    opacity: 0.5;
    font-size: 20px;
    margin-bottom: 5px;
  }
  
  /* Button */
  #proposal-page .btn-accept {
    display: block;
    background: #25D366;
    color: white;
    text-decoration: none;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 18px;
    letter-spacing: 1px;
    margin-top: 30px;
    box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4);
  }
`

export const generateProposalPDF = (
  proposal: Proposal,
  profile: UserProfile,
  themeColor: string,
) => {
  const primaryColor =
    THEME_COLORS[themeColor as AppTheme]?.primary || '#00E676'

  // Header Data
  const dateStr = format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })
  const startWeight = Number(proposal.clientWeight) || 0
  const targetWeight = Number(proposal.clientTargetWeight) || 0
  const deadline = proposal.deadline || 'Prazo definido'
  const whatsappLink = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=Quero%20começar!`

  // Graph SVG Logic
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

  const content = `
    <style>
        ${getProposalStyles()}
    </style>
    <div id="proposal-page">
        <!-- Header -->
        <header class="prop-header">
            <div style="display: flex; align-items: center; gap: 15px;">
                ${profile.avatar ? `<img src="${profile.avatar}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />` : ''}
                <div>
                    <div class="prop-brand">${profile.name}</div>
                    <div class="prop-sub">${proposal.customHeaderTitle || 'Personal Trainer'}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: var(--primary); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Proposta Comercial</div>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${dateStr}</div>
            </div>
        </header>

        <!-- Intro -->
        <div class="prop-hero">
            <div class="prop-hero-title">${proposal.introText || 'Onde você está hoje vs onde pode chegar'}</div>
            <div style="width: 60px; height: 4px; background: var(--primary); margin: 20px auto; border-radius: 2px;"></div>
        </div>

        <!-- Graph -->
        <div class="graph-wrapper">
            <div class="graph-title">Projeção de Resultado</div>
            <div style="width: 100%; height: 200px;">
                ${svgGraph}
            </div>
        </div>

        <!-- Tech Sheet -->
        <div class="section-title" style="margin-bottom: 20px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;">
            ${ICONS.user} Ficha Técnica
        </div>
        <div class="data-grid">
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
             <div class="data-card">
                <div class="data-label">Idade</div>
                <div class="data-value">${proposal.clientAge || '-'}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Altura</div>
                <div class="data-value">${proposal.clientHeight || '-'}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Peso Inicial</div>
                <div class="data-value">${proposal.clientWeight || '-'}</div>
            </div>
        </div>

        <!-- Services -->
        <div class="section-title" style="margin-bottom: 20px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;">
            ${ICONS.dumbbell} SERVIÇOS
        </div>
        <div class="services-list">
            ${
              proposal.services && proposal.services.length > 0
                ? proposal.services
                    .map(
                      (s) => `
                <div class="service-row">
                    <div class="service-icon">${ICONS.check}</div>
                    <div>
                        <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; margin-bottom: 5px;">${s.title}</div>
                        <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">${s.description}</div>
                    </div>
                </div>
            `,
                    )
                    .join('')
                : '<p style="text-align: center; color: #6b7280;">Serviços sob consulta.</p>'
            }
        </div>

        <!-- Summary -->
        ${
          proposal.summary
            ? `
            <div class="section">
              <div class="section-title">RESUMO</div>
              <div class="service-row">
                <div class="service-icon">${ICONS.check}</div>
                <div>
                   <div style="font-size: 14px; color: #374151; font-weight: 500;">${proposal.summary.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>
        `
            : ''
        }

        <!-- Investment -->
        <div class="investment-card">
            <div class="inv-label">Valor Total do Projeto</div>
            ${proposal.discountedValue ? `<div class="inv-old">R$ ${proposal.discountedValue.toFixed(2)}</div>` : ''}
            <div class="inv-price"><span>R$</span>${proposal.value.toFixed(2)}</div>
            
            <div style="font-size: 14px; opacity: 0.8; margin-top: 15px; display: flex; justify-content: center; gap: 20px;">
                <span>Duração: ${proposal.duration}</span>
                <span>Validade: ${proposal.validityDate || 'Consulte'}</span>
            </div>
            
            <a href="${whatsappLink}" target="_blank" class="btn-accept">
                👉 Aceitar e começar!
            </a>
        </div>
        
        <footer style="margin-top: 50px; text-align: center; color: #9ca3af; font-size: 11px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">${profile.name}</div>
            <div>${profile.email} • ${profile.phone}</div>
        </footer>
    </div>
  `

  printHTML(`Proposta - ${proposal.clientName}`, content, primaryColor)
}
