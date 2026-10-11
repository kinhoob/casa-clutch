# Casa Clutch — primeira versão para confirmação

Projeto independente do Estúdio Z. HTML, CSS e JavaScript estáticos com bibliotecas locais GSAP/ScrollTrigger e Lenis. Abra `index.html` no navegador para visualizar o layout; não exige instalação nem build. Pode ser servido por qualquer hospedagem estática, inclusive GitHub Pages em subdiretório, pois usa caminhos relativos.

## Direção proposta

“Sua essência. Próximo nível.” é uma proposta de título editorial. A frase dos donos foi preservada exatamente: “Aqui não muda quem você é... só acelera onde você pode chegar.” Logo original recebido, sem redesenho. Paleta monocromática e artes tipográficas provisórias; direção visual e identidade completa a confirmar. Scheme Engine inspira a narrativa e o ritmo, sem copiar ativos ou layout.

## Conteúdo confirmado

- Pelo usuário: hub físico de criadores, foco em patrocinadores, logo, frase e nome “Cozinhando com a Kika”.
- No canal https://www.youtube.com/@CasaClutch em 11/10/2026: frase, Instagram casa.clutch, 16,2 mil inscritos e 276 vídeos (arredondados, snapshot público).
- Apresentação: https://www.youtube.com/watch?v=MXs665ZSKeQ
- Tour: https://www.youtube.com/watch?v=qy8shmH8G9M — descrição menciona Rex, Santana, sala gamer, setup de lives, piscina aquecida, estúdio de música e ringue de boxe. Disponibilidade atual a confirmar.

## A confirmar

Conceito/títulos/textos propostos; paleta e fontes completas; fotos e reel; cidade/endereço; história e datas; nomes completos/funções/bios/equipe; sinopses/frequência/episódios/artes e outros programas; mídia kit, audiência, alcance/engajamento consolidados; oferta comercial, entregas/valores, contratos; parceiros/cases e autorizações; e-mail/WhatsApp/responsável comercial; domínio e publicação.

As sugestões de patrocínio não são uma oferta aprovada. Não há marcas fictícias, depoimentos ou promessas de alcance. Nomes Rex/Santana aparecem porque foram citados na descrição oficial, sem atribuir cargo de fundador. Kika foi informada pelo usuário; biografia não inventada.

## Funcionalidade e privacidade

Navegação, links oficiais, seções expansíveis, pausa de animações e formulário que baixa um briefing em TXT. O formulário não envia dados, não persiste informações nem simula contato. Sem analytics, fontes externas, vídeo automático ou embeds. Conteúdo visível mesmo com JS desativado. Respeita `prefers-reduced-motion`; GSAP/Lenis são opcionais. Vídeos abrem no YouTube apenas por ação do visitante.

## Arquivos

`index.html`, `style.css`, `main.js`, `assets/logo.png` e `vendor/` (bibliotecas e licenças). `preview.cjs` é um servidor local opcional: `node preview.cjs`; usa 127.0.0.1:5180.

Repositório: https://github.com/kinhoob/casa-clutch (público, com autorização do usuário).

Prévia pública: https://kinhoob.github.io/casa-clutch/

Status: primeira versão para revisão, com informações pendentes marcadas a confirmar. Projeto separado do Estúdio Z. GitHub Pages publica a branch `main`, pasta raiz, com HTTPS e `.nojekyll`. Alterações salvas nessa branch atualizam o site automaticamente.

## Hero e direção escura
Fundo preto, detalhes em cinza escuro e marca branca (versão monocromática do logo original via CSS). A navbar abre apenas com a marca; os links aparecem ao sair da hero. Conteúdo comercial e pendências preservados.

Reel fornecido pelo usuário: DRONE - CLUTCH .mov (4K, 60 fps, 10,87 s). Hero com texto centralizado, clipe completo convertido para MP4 H.264, sem áudio, 30 fps e faststart. Desktop 1920 × 1080 (~5,5 MB); celular 1280 × 720 (~2,45 MB), com recorte central responsivo. Capa extraída do vídeo. Pausa manual, pausa fora da hero/aba oculta e reduced motion (somente capa, sem carregar o vídeo). Arquivos em assets/hero-drone.mp4, assets/hero-drone-mobile.mp4 e assets/hero-poster.jpg.

Produção sugerida: desktop 16:9, 1920 × 1080; mobile 9:16, 1080 × 1920. MP4 H.264 sem áudio, loop de 10–20 segundos; objetivo de até 8 MB no desktop e 4 MB no celular, ajustando conforme qualidade visual. Não incluir texto no vídeo; reservar a região central/esquerda para o texto HTML e manter rostos/ações longe das bordas. Entregar também uma imagem de capa para reduced motion e carregamento. Esses tamanhos e limites são metas deste projeto, não exigências do navegador.
