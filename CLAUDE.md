# BODev-Common — AI-BODev-Common (Frontend Workspace)

> Este repositório é um **mirror seletivo** de `BODev-Common`, configurado via Git Sparse Checkout.
> Contém apenas as pastas relevantes para desenvolvimento frontend, dentro de `common/`.
> **Não fazer commits aqui** — o source of truth é o repositório original.

---

## Estrutura do Repositório

```
AI-BODev-Common/
├── CLAUDE.md
└── common/
    │
    ├── api/                                   # Apenas as subpastas abaixo estão no checkout
    │   ├── 7.4/                               # Versão PHP ativa — única a considerar
    │   ├── controllers/                       # Controllers da API
    │   ├── ekomi/                             # Integração de reviews Ekomi
    │   │   ├── Request/
    │   │   └── Service/
    │   ├── lib/
    │   │   ├── barcode39/                     # Geração de códigos de barras
    │   │   ├── client/                        # Cliente HTTP genérico
    │   │   ├── FacebookAds/                   # ⚠️ NÃO MODIFICAR — integração backend Facebook Ads
    │   │   └── shortener/                     # Encurtador de URLs
    │   └── Mailchimp/                         # Integração Mailchimp
    │
    ├── model/                                 # Modelos de dados partilhados entre plugins
    │
    └── plugins/
        │
        ├── cookies_policy/                    # Gestão de cookies e consentimento RGPD
        ├── emails/                            # Templates de email transacional
        ├── emails_blocks/                     # Blocos reutilizáveis para composição de emails
        │   ├── img/
        │   └── includes/
        ├── featured_product/                  # Componente de produto em destaque
        ├── microdata/                         # Schema.org / structured data para SEO
        ├── onlinechat/                        # Integração de chat online (multi-provider)
        │   ├── css_chat/
        │   ├── js_chat/
        │   ├── sysimagesbo/
        │   ├── _css/
        │   ├── _img/
        │   └── _js/
        ├── search_meilisearch/                # Motor de pesquisa — integração Meilisearch
        ├── shoppingtools/                     # Ferramentas de compra transversais
        │   ├── activeCampaigns/               # Campanhas ativas / promoções
        │   ├── click_collect/                 # Funcionalidade Click & Collect
        │   ├── geo_limited_delivery/          # Entregas com limitação geográfica
        │   ├── notification_bar/              # Barra de notificações global
        │   └── tooltip/                       # Tooltips reutilizáveis
        ├── sizefit/                           # Guia de tamanhos / recomendação de fit
        │
        ├── system/                            # ⚠️ Recursos globais — NÃO MODIFICAR sem análise de impacto
        │   ├── css/                           # CSS base do sistema
        │   ├── js/                            # Bibliotecas JS partilhadas por todos os templates
        │   │   ├── common/1.3/{css,js}        # Utilitários comuns v1.3
        │   │   ├── formio/                    # Renderização de formulários
        │   │   ├── googlemaps/                # Integração Google Maps
        │   │   ├── impetus360/                # Touch/swipe handler
        │   │   ├── jquery-headroom/           # Header hide-on-scroll
        │   │   ├── jquery-ui/                 # jQuery UI components
        │   │   ├── jquery.base64/
        │   │   ├── jquery.cookie/
        │   │   ├── jquery.sticky-kit/
        │   │   ├── jquery.ui.touch-punch/     # Touch support para jQuery UI
        │   │   ├── js-storage/                # Abstração de localStorage/sessionStorage
        │   │   ├── jsvat/                     # Validação de NIF/VAT europeu
        │   │   ├── leafletjs/                 # Mapas open-source (alternativa a Google Maps)
        │   │   ├── masonry/                   # Layout em grelha dinâmica
        │   │   └── pinch-zoom/                # Zoom por gestos touch
        │   ├── sysimgs/
        │   │   └── flags/svg/                 # Flags de países em SVG (para seletores de idioma/país)
        │   └── woff/                          # Fontes do sistema
        │
        ├── timemachine/                       # Ferramenta de preview temporal (ver site numa data futura/passada)
        │   ├── css/
        │   ├── img/
        │   └── js/
        ├── trackings/                         # Tracking de analytics e conversões (GA, GTM, etc.)
        ├── visualpager_blocks/                # Blocos visuais do Visual Pager (versão standard)
        │   ├── css/
        │   ├── includes/
        │   ├── js/
        │   └── sys_images/
        ├── visualpager_blocks_pwa/            # Blocos Visual Pager — versão PWA (sem JS blocante)
        │   ├── css/
        │   ├── includes/
        │   └── sys_images/
        ├── welcome_gift/                      # Oferta de boas-vindas (first visit)
        ├── addons/                            # Addons genéricos e experimentais
        │
        ├── templates_account/                 # Templates da área de cliente (login, conta, encomendas)
        │   └── v1/                            # Versão ativa — única versão existente
        │       ├── account_return_order/
        │       ├── css/
        │       ├── js/
        │       ├── sysimgs/
        │       ├── system/
        │       └── trackings/
        │
        └── templates_base/                    # Templates base da plataforma (frontend principal)
            │                                  # Convenção: [layout][variante] ex: 11=layout1/var1, 21=layout2/var1
            │                                  # Versões 1x são LEGACY — evitar modificar
            │                                  # Versões 2x são as versões ATIVAS
            │
            ├── blog/12/
            ├── brands/{11,12}/
            ├── careers/11/
            ├── client_card/11/
            ├── comparator/
            │   ├── 12/
            │   └── product_item_comparator/1/
            ├── contacts/{11,12}/
            ├── content_blocks/1/
            ├── content_blocks_pwa/1/
            ├── creator/11/
            ├── creators/11/
            ├── download/{11,12}/
            ├── driveme/1/
            ├── error_pages/                   # Páginas de erro (404, 500, manutenção)
            ├── events/{11,12}/
            ├── events_detail/11/
            ├── faqs/{11,12,13,14,15}/
            ├── faqs_detail/11/
            │
            ├── footer/
            │   ├── 11/                        # LEGACY
            │   ├── 12/                        # LEGACY
            │   ├── 21/                        # Versão ativa
            │   └── components/                # Subcomponentes partilhados entre versões do footer
            │
            ├── gift_card/{11,12}/
            │
            ├── header/
            │   ├── 11/                        # LEGACY
            │   ├── 12/                        # LEGACY
            │   ├── 13/                        # LEGACY
            │   ├── 21/                        # Versão ativa
            │   ├── 22/                        # Versão ativa — variante
            │   └── components/                # Subcomponentes partilhados entre versões do header
            │       ├── tooltip_account/{1,2}/
            │       └── tooltip_country/1/
            │
            ├── header_search/{11,12,21}/      # 11,12 LEGACY — 21 versão ativa
            ├── home/11/
            ├── menu_mobile/{11,12,13,21}/     # 11,12,13 LEGACY — 21 versão ativa
            │
            ├── mini_cart/
            │   ├── 11/ 12/ 13/ 14/ 15/ 16/   # ⚠️ LEGACY — não modificar
            │   ├── 21/ 22/ 23/ 24/            # Versões ativas
            │   └── components/                # Partilhados pelas versões ativas
            │       ├── campaign_slider/1/
            │       └── pack_info/1/
            │
            ├── mini_cart_recomendation/
            │   ├── 11/ 12/ 13/ 14/ 15/        # ⚠️ LEGACY — não modificar
            │   ├── 21/ 22/ 23/ 24/            # Versões ativas
            │   └── components/
            │       └── products_slider/1/
            │
            ├── news/{11,12}/
            ├── news_detail/{11,12,13}/
            ├── order_status/1/
            ├── page/{11,iban}/
            ├── policy/{1,2,11,12}/            # 1,2 LEGACY — 11,12 versões ativas
            │
            ├── product/
            │   ├── components/                # Componentes globais de produto (partilhados)
            │   └── 11/                        # Versão ativa da página de produto
            │       ├── areas/                 # Zonas configuráveis da página (posicionamento de blocos)
            │       │   ├── a/{1,2,21,22}/     # Zona A: área principal (galeria/imagem)
            │       │   ├── b/21/              # Zona B: informação do produto
            │       │   ├── c/{1,21}/          # Zona C: área secundária
            │       │   └── d/1/               # Zona D: área inferior
            │       └── components/            # Blocos funcionais independentes
            │           ├── bar/21/            # Barra de ação (add to cart, etc.)
            │           ├── care_instructions/21/
            │           ├── colors/21/         # Seletor de cores
            │           ├── combine/1/         # Combinar produtos
            │           ├── complement_with/1/ # Produtos complementares
            │           ├── composition/21/    # Composição/materiais
            │           ├── configurator/{1,2}/# Configurador de produto
            │           ├── customization/1/   # Personalização
            │           ├── extra_configurator/1/
            │           ├── extra_info/{1,2}/
            │           ├── faqs/{1,2}/        # FAQs específicas do produto
            │           ├── levels_discount/1/ # Descontos por quantidade
            │           ├── lots/1/            # Venda por lotes
            │           ├── market_proposals/21/
            │           ├── packs/21/          # Packs de produto
            │           │   └── group/{1}/
            │           │   └── group_catalog/{1}/
            │           ├── packs_complement/1/
            │           ├── preview_360/1/     # Visualização 360°
            │           ├── review/{1,2}/      # Reviews/avaliações
            │           ├── services/{1,2}/    # Serviços associados ao produto
            │           ├── sizeguide/21/      # Guia de tamanhos inline
            │           ├── technical_info/21/
            │           ├── technologies/21/
            │           ├── variants/21/       # Seletor de variantes (cor, tamanho, etc.)
            │           └── zoom/
            │               ├── desktop/2/     # Zoom hover no desktop
            │               └── mobile/1/      # Zoom touch no mobile
            │
            ├── product_item/21/               # Card de produto em listagem
            ├── product_item_horizontal/11/    # Card de produto layout horizontal
            │
            ├── product_list/
            │   └── 2/                         # Versão ativa da listagem de produtos
            │       ├── areas/                 # Zonas configuráveis (mesma lógica que product)
            │       │   ├── a/{11,12,13,14,21}/
            │       │   ├── b/11/
            │       │   ├── banner1/1/
            │       │   ├── banner2/1/
            │       │   ├── c/{1,11,12,21}/
            │       │   ├── d/{1,11}/
            │       │   ├── e/1/
            │       │   └── f/{1,2,11,12}/
            │       └── components/
            │           ├── ads/1/
            │           ├── bannerhorizontal/1/
            │           └── filters/mobile/11/ # Filtros versão mobile
            │
            ├── scheduling/11/
            ├── scheduling_detail/11/
            │
            ├── search/
            │   └── 2/                         # Mesma estrutura de areas que product_list/2
            │       └── areas/
            │           ├── a/{11,12,13,14,21}/
            │           ├── b/11/
            │           ├── banner1/1/ banner2/1/
            │           ├── c/{1,11,12,21}/
            │           ├── d/{1,11}/
            │           ├── e/1/
            │           └── f/{1,2,11,12}/
            │
            ├── service/11/
            ├── service_list/11/
            ├── shipping_express/1/
            ├── shipping_faqs/{11,12}/
            ├── shopbylook/{11,12}/
            ├── shopbylook_detail/{11,12,13}/
            ├── size_guide/11/
            ├── storeavailability/{11,12,13,14}/
            ├── stores/{11,12}/
            ├── stores_detail/11/
            ├── submenu/{11,12,13,14,21,22}/   # 11–14 LEGACY — 21,22 versões ativas
            ├── terms/{11,12}/
            ├── testimony/
            │   ├── 11/
            │   ├── 12/
            │   └── popup_testimony/11/
            ├── unsubscribe_email/1/
            ├── unsubscribe_sms/1/
            ├── wishlist/
            │   ├── 11/                        # LEGACY
            │   ├── 12/                        # Versão ativa
            │   └── popup_share/{11,12,13}/
            └── wishlist_public/11/
```

---

## templates_base — Referência Rápida de Componentes

| Componente | Versões disponíveis |
|---|---|
| `header` | **legacy:** 11, 12, 13 / **ativas:** 21, 22 + components |
| `header_search` | **legacy:** 11, 12 / **ativa:** 21 |
| `footer` | **legacy:** 11, 12 / **ativa:** 21 + components |
| `menu_mobile` | **legacy:** 11, 12, 13 / **ativa:** 21 |
| `submenu` | **legacy:** 11, 12, 13, 14 / **ativas:** 21, 22 |
| `mini_cart` | **legacy:** 11–16 / **ativas:** 21–24 + components |
| `mini_cart_recomendation` | **legacy:** 11–15 / **ativas:** 21–24 + components |
| `product` | 11 (com areas a/b/c/d e múltiplos components) |
| `product_item` | 21 |
| `product_item_horizontal` | 11 |
| `product_list` | 2 (com areas a–f e components) |
| `search` | 2 (estrutura de areas idêntica a product_list) |
| `home` | 11 |
| `content_blocks` | 1 |
| `content_blocks_pwa` | 1 |
| `faqs` | 11, 12, 13, 14, 15 + faqs_detail/11 |
| `news` | 11, 12 + news_detail/11, 12, 13 |
| `blog` | 12 |
| `brands` | 11, 12 |
| `stores` | 11, 12 + stores_detail/11 |
| `storeavailability` | 11, 12, 13, 14 |
| `wishlist` | **legacy:** 11 / **ativa:** 12 + popup_share/11,12,13 |
| `wishlist_public` | 11 |
| `shopbylook` | 11, 12 + shopbylook_detail/11, 12, 13 |
| `gift_card` | 11, 12 |
| `order_status` | 1 |
| `page` | 11, iban |
| `policy` | **legacy:** 1, 2 / **ativas:** 11, 12 |
| `terms` | 11, 12 |
| `contacts` | 11, 12 |
| `careers` | 11 |
| `events` | 11, 12 + events_detail/11 |
| `scheduling` | 11 + scheduling_detail/11 |
| `service` | 11 + service_list/11 |
| `shipping_express` | 1 |
| `shipping_faqs` | 11, 12 |
| `size_guide` | 11 |
| `testimony` | 11, 12 + popup_testimony/11 |
| `error_pages` | — |
| `unsubscribe_email` | 1 |
| `unsubscribe_sms` | 1 |
| `download` | 11, 12 |
| `client_card` | 11 |
| `comparator` | 12 + product_item_comparator/1 |
| `creator` / `creators` | 11 |
| `driveme` | 1 |

---

## Pastas EXCLUÍDAS deste workspace (não fazer referência)

As seguintes pastas existem no repositório original mas **não estão disponíveis** neste checkout:

- `common/account/` — Lógica de conta (backend PHP)
- `common/checkout/` — Processo de checkout (backend)
- `common/classmail/` — Classes de email com OAuth2 (backend PHP)
- `common/cronjobs/` — Tarefas agendadas (backend)
- `common/plugins/templates_base_b2b/` — Templates B2B (fora do scope)
- `common/plugins/templates_sales/` — Templates de saldos (fora do scope)
- `common/plugins/tracker/` — Tracker interno (backend)
- `common/api/5.6/`, `common/api/7.1/` — Versões legacy da API (PHP antigo)
- `common/api/lib/PHPExcel/` — Biblioteca legacy Excel
- `common/api/lib/mpdf/` — Geração de PDF (backend)

---

## Convenções de Código

- **Linguagem dos comentários:** Português
- **Linguagem do código:** Inglês
- **Versionamento de templates:** `[layout_version][variant]` (ex: `11` = layout 1, variante 1; `21` = layout 2, variante 1)
- **Versões legacy vs ativas:** versões `1x` são legacy (não modificar salvo exceção justificada); versões `2x` são as ativas
- **Componentes reutilizáveis:** sempre dentro de pasta `/components`
- **Areas:** `product`, `product_list` e `search` usam subpastas `/areas/[letra]/[versão]` para zonas configuráveis da página
- **PWA:** variantes PWA têm sufixo `_pwa` no nome da pasta

---

## Sincronização com o Repositório Original

Para atualizar este workspace com as últimas alterações:

```powershell
cd "C:\Users\Luis Gomes\Desktop\localserver\_projects\AI-BODev-Common"
git pull origin main
```

Apenas os ficheiros dentro das pastas configuradas no sparse-checkout serão atualizados.

Para ver as pastas atualmente ativas:
```powershell
git sparse-checkout list
```

Para adicionar uma nova pasta ao workspace:
```powershell
git sparse-checkout add common/plugins/nova_pasta
```

---

## Tarefas Frequentes para o Claude Code

### Quando criar um novo template
1. Identificar o componente base em `common/plugins/templates_base/[componente]/`
2. Verificar a versão mais recente disponível (versões `2x` são as ativas)
3. Seguir a estrutura de pastas existente (`components/`, `areas/`, `css/`, `js/`)
4. Não criar versões `1x` — usar sempre numeração `2x` para trabalho novo

### Quando modificar templates existentes
- Verificar se a versão é **legacy (1x)** antes de alterar — preferir criar nova versão ou adaptar a `2x`
- Alterações em `plugins/system/` afetam **todos os templates** — requerem análise de impacto

### Quando trabalhar com plugins
- Os plugins em `common/plugins/` são independentes e reutilizáveis entre templates
- Recursos globais (jQuery, CSS base, fontes) estão em `common/plugins/system/` — **não duplicar**
- Verificar dependências no `common/api/7.4/` antes de modificar integrações

### Quando trabalhar com emails
- Templates em `common/plugins/emails/`
- Blocos reutilizáveis em `common/plugins/emails_blocks/` (com subpastas `img/` e `includes/`)

### Quando trabalhar com product / product_list / search
- As **areas** (a, b, c...) são zonas configuráveis — cada letra representa uma posição na página
- Os **components** dentro de `product/11/` são blocos funcionais independentes
- `search/2/` partilha a mesma estrutura de areas que `product_list/2/`

### Considerações sobre Configurações de Backoffice (BO)
- Existe um ficheiro `bo_template_settings_v3.md` na raiz do repositório que detalha as configurações de Backoffice que influenciam o comportamento das templates HTML.
- **É crucial consultar este ficheiro** ao analisar ou modificar templates, pois as configurações do BO podem sobrepor ou alterar o comportamento padrão do código.
- Em caso de dúvida sobre um comportamento inesperado no frontend, a primeira ação deve ser verificar as configurações relevantes neste ficheiro.
