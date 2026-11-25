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
- **GitHub Actions** para Deploy contínuo no GitHub Pages

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
   - Em **Build and deployment > Source**, selecione: **GitHub Actions**
   - O workflow `.github/workflows/deploy.yml` será executado automaticamente a cada push!

4. Seu site estará disponível em:
   `https://<seu-usuario>.github.io/price-jopi/`
