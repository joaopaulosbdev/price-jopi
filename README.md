# PriceTracker - Monitor de Preços

Aplicação web interativa para monitorar e acompanhar o histórico de preços de produtos por **nome** e **marca**.

## 🚀 Funcionalidades
- **Filtro em tempo real**: busca textual por nome do produto, modelo ou palavras-chave.
- **Filtro dinâmico por marca**: selecione marcas cadastradas (ex: Sony, Apple, Samsung, Nespresso) ou cadastre novas marcas.
- **Histórico e Gráficos de Evolução**: gráficos interativos (Recharts) com histórico de cotações, menor/maior preço e variação percentual.
- **Metas e Preço Alvo**: defina seu preço desejado e receba alertas visuais automáticos quando a meta for atingida.
- **Armazenamento 100% Funcional no GitHub Pages**: utiliza camada de persistência local (LocalStorage) no cliente, funcionando totalmente estático sem necessidade de servidor back-end.

## 🛠️ Tecnologias
- **Next.js 16** (App Router, Static Export)
- **TypeScript** & **Tailwind CSS**
- **Recharts** & **Lucide React**
- **GitHub Pages** para hospedar a exportação estática

---

## 📦 Como Ativar o GitHub Pages no seu Repositório

1. Crie o repositório no seu GitHub com o nome **`price-jopi`**:
   - Acesse: [https://github.com/new](https://github.com/new)
   - Nome: `price-jopi`
   - Visibilidade: **Public** (ou Private se tiver plano Pro para Pages)

2. No terminal do projeto, execute o push:
   ```bash
   git push -u origin main
   ```

3. No GitHub, acesse as configurações do repositório:
   - Vá em **Settings** > **Pages**
   - Em **Build and deployment > Source**, selecione **Deploy from a branch** e escolha `gh-pages` e `/ (root)`.
   - Rode `npm run build` e publique a pasta `out` com `npx gh-pages -d out --nojekyll`.

4. Seu site estará disponível em:
   `https://<seu-usuario>.github.io/price-jopi/`

## Busca automática de ofertas

O gráfico consulta produtos no Google Shopping e na Shopee Brasil, usa a faixa informada e mantém o menor preço encontrado para cada modelo identificado. Os links abrem o anúncio na loja. O histórico de cotações manuais continua disponível.

O site estático acessa o serviço em `offers-worker/`. Para ativar a busca:

1. Publique o serviço com `npx wrangler deploy --config offers-worker/wrangler.toml`. Ajuste `SITE_ORIGIN` no arquivo se usar outro domínio.
2. Cadastre `SERPAPI_API_KEY`, `SHOPEE_APP_ID` e `SHOPEE_SECRET` com `npx wrangler secret put NOME --config offers-worker/wrangler.toml`. A Shopee exige acesso à [Open API de Afiliados](https://affiliate.shopee.com.br/open_api).
3. Defina `NEXT_PUBLIC_OFFERS_API_URL` como a URL HTTPS do serviço seguida de `/offers`. Rode `npm run build` novamente e publique a pasta `out` no GitHub Pages.

Para testar localmente com um serviço de desenvolvimento, use `http://localhost:3000` como `SITE_ORIGIN` e aponte `NEXT_PUBLIC_OFFERS_API_URL` para o serviço local. A cobertura depende do catálogo disponível nas fontes. A comparação usa o preço anunciado em reais, sem frete.
