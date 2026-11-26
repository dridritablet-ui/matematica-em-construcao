const curriculum = [{"week": 1, "title": "Sistema de numeração e operações", "topics": ["Leitura e escrita dos números naturais", "Adição", "Subtração", "Resolução de problemas com adição e subtração"]}, {"week": 2, "title": "Multiplicação", "topics": ["Multiplicação: significado e propriedades", "Tabuada e cálculo mental", "Multiplicação por números naturais", "Problemas de multiplicação"]}, {"week": 3, "title": "Divisão", "topics": ["Divisão: significado e termos", "Divisão exata e não exata", "Relação entre multiplicação e divisão", "Problemas de divisão"]}, {"week": 4, "title": "Divisibilidade", "topics": ["Múltiplos e divisores", "Critérios de divisibilidade", "Números primos e fatoração", "Mínimo múltiplo comum (MMC) e máximo divisor comum (MDC)"]}, {"week": 5, "title": "Frações", "topics": ["Ideia de fração e representação", "Tipos de fração", "Frações equivalentes", "Simplificação e comparação de frações"]}, {"week": 6, "title": "Operações com frações", "topics": ["Adição e subtração de frações", "Multiplicação de frações", "Divisão de frações", "Problemas com frações"]}, {"week": 7, "title": "Números decimais e negativos", "topics": ["Números decimais", "Operações com números decimais", "Números inteiros e reta numérica", "Operações com números negativos"]}, {"week": 8, "title": "Razão e proporção", "topics": ["Razão", "Proporção", "Grandezas diretamente proporcionais", "Grandezas inversamente proporcionais"]}, {"week": 9, "title": "Porcentagem, escalas e medidas", "topics": ["Porcentagem", "Aumentos e descontos percentuais", "Escalas", "Unidades de medida e conversões"]}, {"week": 10, "title": "Potenciação e radiciação", "topics": ["Potenciação", "Propriedades das potências", "Raiz quadrada e outras raízes", "Expressões com potências e raízes"]}, {"week": 11, "title": "Introdução à álgebra", "topics": ["Linguagem matemática e variáveis", "Expressões algébricas", "Valor numérico de expressões", "Simplificação de expressões"]}, {"week": 12, "title": "Produtos notáveis e fatoração", "topics": ["Monômios e polinômios", "Produtos notáveis", "Fator comum em evidência", "Técnicas básicas de fatoração"]}, {"week": 13, "title": "Equações e sistemas", "topics": ["Equações do 1º grau", "Problemas com equações", "Sistemas de equações do 1º grau", "Inequações básicas"]}, {"week": 14, "title": "Funções", "topics": ["Plano cartesiano e pares ordenados", "Conceito de função", "Função afim e gráfico", "Função quadrática e gráfico"]}, {"week": 15, "title": "Quadrática e logaritmos", "topics": ["Equação do 2º grau", "Discriminante e fórmula resolutiva", "Função exponencial", "Introdução aos logaritmos"]}, {"week": 16, "title": "Fundamentos de geometria", "topics": ["Ponto, reta e plano", "Ângulos e suas relações", "Retas paralelas e perpendiculares", "Polígonos e classificação"]}, {"week": 17, "title": "Geometria plana", "topics": ["Perímetro e área", "Triângulos e quadriláteros", "Circunferência e círculo", "Teorema de Pitágoras"]}, {"week": 18, "title": "Geometria espacial e trigonometria", "topics": ["Prismas, pirâmides, cilindros, cones e esferas", "Área e volume de sólidos", "Razões trigonométricas no triângulo retângulo", "Seno, cosseno e tangente"]}, {"week": 19, "title": "Estatística, combinatória e probabilidade", "topics": ["Leitura de tabelas e gráficos", "Média, mediana e moda", "Princípio fundamental da contagem", "Probabilidade básica"]}, {"week": 20, "title": "Revisão e consolidação", "topics": ["Revisão de aritmética e frações", "Revisão de razão, proporção e porcentagem", "Revisão de álgebra e funções", "Revisão de geometria, estatística e simulado"]}];
const KEY='matematica-construcao-v2';
const $=id=>document.getElementById(id);
let activeTopic=null;
function storageGet(key,fallback=''){
  try { const v=localStorage.getItem(key); return v===null?fallback:v; } catch(e){ return fallback; }
}
function storageSet(key,value){
  try { localStorage.setItem(key,value); return true; } catch(e){ return false; }
}
function readProgress(){
  try { const value=JSON.parse(storageGet(KEY+'-progress','{}')); return value&&typeof value==='object'?value:{}; }
  catch(e){ return {}; }
}
let progress=readProgress();
function topicId(w,t){return `w${w}-t${t}`}
function getState(id){return progress[id]||{read:false,video:false,practice:false,complete:false}}
function allTopics(){return curriculum.flatMap(w=>w.topics.map((name,i)=>({week:w.week,title:w.title,name,id:topicId(w.week,i)})))}
function render(){
 const all=allTopics(),done=all.filter(x=>getState(x.id).complete).length,pct=Math.round(done/all.length*100);
 $('overallPercent').textContent=pct+'%';$('overallBar').style.width=pct+'%';$('doneCount').textContent=done;$('totalCount').textContent=all.length;
 const filter=$('weekFilter').value;
 $('weeks').innerHTML=curriculum.map(w=>{
  const finished=w.topics.filter((_,i)=>getState(topicId(w.week,i)).complete).length;
  if(filter==='done'&&finished!==w.topics.length)return '';
  if(filter==='pending'&&finished===w.topics.length)return '';
  return `<article class="week-card"><button class="week-head" type="button" aria-expanded="false"><span><span class="week-title">Semana ${w.week} — ${w.title}</span><span class="week-sub">${w.topics.length} conteúdos · ${finished} concluídos</span></span><span class="week-progress">${Math.round(finished/w.topics.length*100)}%　⌄</span></button><div class="topic-list">${w.topics.map((name,i)=>{const id=topicId(w.week,i),s=getState(id);return `<div class="topic-row"><div><strong>${s.complete?'<span class="done-dot">✓</span>':''}${name}</strong><small>${[s.read,s.video,s.practice].filter(Boolean).length}/3 etapas de estudo</small></div><button class="topic-open" type="button" data-week="${w.week}" data-topic="${i}">Abrir conteúdo →</button></div>`}).join('')}</div></article>`
 }).join('');
}
function openTopic(w,t){
 const week=curriculum[w-1],name=week.topics[t],id=topicId(w,t),s=getState(id);activeTopic=id;
 $('dialogWeek').textContent=`SEMANA ${w} · ${week.title.toUpperCase()}`;$('dialogTitle').textContent=name;
 $('dialogIntro').textContent='Siga as etapas na ordem: primeiro a leitura, depois a explicação em vídeo e, por fim, a prática.';
 $('dialogReading').textContent='Livro principal: O Algebrista. Consulte a seção correspondente a este assunto. Capítulo e páginas serão informados após conferência da edição.';
 $('dialogVideo').textContent='Videoaula específica sobre '+name.toLowerCase()+'. Link e minuto inicial/final serão adicionados após seleção e conferência da aula.';
 $('dialogPractice').textContent='Resolva a lista de exercícios deste assunto, começando pelos exemplos e avançando para as questões de fixação.';
 ['read','video','practice','complete'].forEach(k=>{$(k+'Check').checked=!!s[k]});
 if(typeof $('lessonDialog').showModal==='function') $('lessonDialog').showModal();
 else $('lessonDialog').setAttribute('open','');
}
function saveProgress(){storageSet(KEY+'-progress',JSON.stringify(progress));render()}
function init(){
 if(!$('weeks'))return;
 $('weeks').addEventListener('click',e=>{
  const head=e.target.closest('.week-head');
  if(head){const card=head.closest('.week-card');card.classList.toggle('open');head.setAttribute('aria-expanded',card.classList.contains('open')?'true':'false');return;}
  const button=e.target.closest('.topic-open');
  if(button)openTopic(Number(button.dataset.week),Number(button.dataset.topic));
 });
 ['read','video','practice','complete'].forEach(k=>$(k+'Check').addEventListener('change',e=>{
  if(!activeTopic)return;
  const s=getState(activeTopic);s[k]=e.target.checked;
  if(k==='complete'&&e.target.checked){s.read=true;s.video=true;s.practice=true;['read','video','practice'].forEach(x=>$(x+'Check').checked=true)}
  if(k!=='complete'&&!e.target.checked){s.complete=false;$('completeCheck').checked=false}
  progress[activeTopic]=s;saveProgress();
 }));
 $('weekFilter').addEventListener('change',render);
 $('menuButton').addEventListener('click',()=>$('mainNav').classList.toggle('show'));
 document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>$('mainNav').classList.remove('show')));
 function setupNotebook(id,button,status,key){$(id).value=storageGet(KEY+'-'+key,'');$(button).addEventListener('click',()=>{$(status).textContent=storageSet(KEY+'-'+key,$(id).value)?'Salvo neste dispositivo.':'Não foi possível salvar neste navegador.'})}
 setupNotebook('notes','saveNotes','notesStatus','notes');setupNotebook('errors','saveErrors','errorsStatus','errors');
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
