# Definições Gerais de Templates (BO)

## Visão Geral

As **Definições Gerais de Templates** no Backoffice (BO) têm impacto
direto no comportamento do frontend.

Estas configurações: - alteram layout - controlam visibilidade de
elementos - modificam comportamento de componentes - podem introduzir
variações sem alteração de código

⚠️ **Importante:**\
O frontend pode comportar-se de forma diferente dependendo destas
configurações.

------------------------------------------------------------------------

## Regras para o agente

Ao analisar código relacionado com templates, cabeçalhos, listagens, componentes visuais, ou qualquer funcionalidade do frontend, é **imperativo** considerar a influência das **Definições Gerais de Templates (BO)**. Estas configurações podem alterar significativamente o layout, controlar a visibilidade de elementos, modificar o comportamento de componentes e introduzir variações sem alteração direta no código-fonte.

**Diretrizes:**

1.  **Prioridade das Configurações BO**: Assume sempre que o comportamento do frontend pode ser diretamente influenciado ou sobreposto pelas configurações do Backoffice. Nunca assumes um comportamento fixo ou que o código é a única fonte de verdade para a lógica de apresentação.
2.  **Validação Ativa**: Antes de concluir sobre a causa de um comportamento ou de identificar um potencial bug, valida ativamente se alguma das configurações BO listadas neste documento está a influenciar o resultado. Considera as seguintes categorias de configurações:
    *   **Opções Gerais**: Como a funcionalidade de comparação de produtos (`list_allow_compare`) ou a largura da grid (`template_grid_limit`).
    *   **Header**: Visibilidade de ícones (`desktop_toggle_button`), comportamento de scroll (`hide_header_list`), transparência (`header_allow_transparent`), comportamento e localização da pesquisa (`search_layout`, `search_position`), número de resultados rápidos (`header_quick_search_prod`), e visibilidade do seletor de país/idioma (`header_hide_market_change`).
    *   **Submenus**: Disposição de imagens (`vertical_image`), posicionamento de texto sobre imagens (`submenu_text_over_image`), e versão de abertura do submenu (`submenu_version`).
    *   **Tooltip My Account**: Exibição de ícones (`tooltip_account_icons`) e layout (`header_tooltip_account`).
    *   **Menu Mobile**: Localização do botão fechar (`mob_close_button_order`), visibilidade de elementos como Click and Collect (`mob_click_collect`), pesquisa (`mob_search`), e tipo de exibição de sessão/conta (`mob_session_buttons`, `mob_username_account`). Comportamento do footer (`mob_menu_bottom_fixed`) e layout do menu (`mob_menu_abertura`, `mob_menu_layout`).
    *   **Footer**: Visibilidade de áreas customizadas (`footer_extra_component`), imagens customizadas (`footer_img_cst`), logótipo (`footer_show_logo`), e seletor de país/idioma (`footer_hide_market_change`).
    *   **Páginas Específicas**: Configurações para sliders na homepage (`homepage_slider_dots`, `homepage_slider_arrows`), layouts de filtros em listagens de produtos (`list_filters_layout`), versões de áreas em detalhes de produto (`detail_area_a_version`, etc.), exibição de heading e quantidade de itens por linha em blog (`blog_detail_heading`, `blog_list_grid`), downloads (`downloads_prods_grid`), eventos (`events_list_qtd`), conta (`myAccountIntroDisplaySummary`), notícias (`news_list_qtd`), comparador (`product_add_cart_comparator`), e wishlist (`addCartByWishlist`, `wishlist_public`).
3.  **Questionamento Proativo**: Em caso de dúvida sobre a origem de um comportamento inesperado ou uma discrepância entre o código e o resultado visível, pergunta sempre: "Existe alguma configuração de BO a influenciar este comportamento?" Menciona o atributo específico se tiveres uma suspeita.

------------------------------------------------------------------------

## Opções Gerais

### Comparador

-   **Atributo:** `list_allow_compare`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Desativo
    -   `1` → Ativo

👉 Controla a exibição da funcionalidade de comparação de produtos.

------------------------------------------------------------------------

### Grid para largura das referências base

-   **Atributo:** `template_grid_limit`
-   **Valor atual:** `12`
-   **Valores possíveis:** `10`, `12`

👉 Afeta a largura máxima da grid no layout.

------------------------------------------------------------------------

### Wishlist: Seleção de tamanho

-   **Atributo:** `add_wishlist_select_size`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Não obrigatório
    -   `1` → Obrigatório

👉 Pode bloquear ações se não existir seleção de variante.

------------------------------------------------------------------------

## Templates Base: Header

### Ícone no primeiro menu

-   **Atributo:** `desktop_toggle_button`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Não exibir
    -   `1` → Exibir

👉 Afeta visibilidade do botão/menu principal.

------------------------------------------------------------------------

### Ocultar ao fazer scroll nas listagens

-   **Atributo:** `hide_header_list`
-   **Valor atual:** `0`
-   **Valores possíveis:**
    -   `0` → Desativo
    -   `1` → Apenas mobile
    -   `2` → Apenas desktop
    -   `3` → Ambos

👉 Controla comportamento sticky/visibilidade do header.

------------------------------------------------------------------------

### Permitir transparência

-   **Atributo:** `header_allow_transparent`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Não
    -   `1` → Sim

👉 Pode alterar estilos (background, overlay, contraste).

------------------------------------------------------------------------

### Pesquisa: Comportamento da input

-   **Atributo:** `search_layout`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Após clique no botão
    -   `1` → Sempre visível

👉 Impacta UX e estrutura do header.

------------------------------------------------------------------------

### Pesquisa: Localização

-   **Atributo:** `search_position`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Esquerda
    -   `1` → Direita

👉 Pode afetar alinhamentos e CSS.

------------------------------------------------------------------------

### Pesquisa: Resultados rápidos

-   **Atributo:** `header_quick_search_prod`
-   **Valor atual:** `4`
-   **Valores possíveis:** (numérico, default: 4)

👉 Define número de produtos mostrados no dropdown.

------------------------------------------------------------------------

### Seleção de país/idioma

-   **Atributo:** `header_hide_market_change`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Exibir
    -   `1` → Esconder

👉 Afeta visibilidade do seletor de mercado.

------------------------------------------------------------------------

### Submenu: Disposição das imagens

-   **Atributo:** `vertical_image`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Horizontal
    -   `1` → Vertical

👉 Impacta layout visual dos menus.

------------------------------------------------------------------------

### Submenu: Texto das imagens

-   **Atributo:** `submenu_text_over_image`
-   **Valor atual:** `0`
-   **Valores possíveis:**
    -   `0` → Em baixo
    -   `1` → Sobre a imagem

👉 Pode alterar posicionamento absoluto/relativo.

------------------------------------------------------------------------

### Submenu: Versão

-   **Atributo:** `submenu_version`
-   **Valor atual:** `0`
-   **Valores possíveis:**
    -   `0` → Abertura sobreposta
    -   `1` → Abertura expandida

👉 Impacta estrutura DOM e comportamento do menu.

------------------------------------------------------------------------

### Tooltip do My Account: Ícones

-   **Atributo:** `tooltip_account_icons`
-   **Valor atual:** `1`
-   **Valores possíveis:**
    -   `0` → Não exibir
    -   `1` → Exibir

👉 Afeta conteúdo visual do tooltip.

------------------------------------------------------------------------

### Tooltip do My Account: Layout

-   **Atributo:** `header_tooltip_account`
-   **Valor atual:** `2`
-   **Valores possíveis:**
    -   `0` → Não exibir
    -   `1` → Uma linha
    -   `2` → Duas linhas

👉 Pode alterar estrutura e styling do componente.

------------------------------------------------------------------------

## Notas finais

-   Estas configurações podem sobrepor comportamento definido em código
-   Alterações no BO podem causar efeitos inesperados no frontend
-   Nem todos os comportamentos visíveis são controlados diretamente
    pelo código

👉 Sempre considerar estas definições antes de concluir que algo é bug
ou problema de implementação



---

## Templates base: menu_mobile - Opções

### Elemento: Botão fechar - Localização
- **Atributo:** `mob_close_button_order`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Esquerda
  - `1` → Direita

### Elemento: Click and Collect
- **Atributo:** `mob_click_collect`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Não exibe
  - `1` → Exibir

### Elemento: Iniciar sessão/conta
- **Atributo:** `mob_session_buttons`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Links
  - `1` → Botão

### Elemento: Minha conta
- **Atributo:** `mob_username_account`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Exibir [a minha conta]
  - `1` → Exibir [Olá, NomeUser]

### Elemento: Pesquisa
- **Atributo:** `mob_search`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não exibe
  - `1` → Exibir

### Exibir último nível na listagem
- **Atributo:** `mob_show_level_listpage`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não exibe
  - `1` → Exibir

### Footer: Comportamento
- **Atributo:** `mob_menu_bottom_fixed`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Acompanha altura
  - `1` → Fixo

### Menu: Abertura
- **Atributo:** `mob_menu_abertura`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → FadeIn
  - `1` → Slide

### Menu: Layout
- **Atributo:** `mob_menu_layout`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Slide
  - `1` → Acordeão

---

## Templates base: footer - Opções

### Custom área
- **Atributo:** `footer_extra_component`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Topo
  - `2` → Fim
  - `3` → Meio

### Custom imagem
- **Atributo:** `footer_img_cst`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Sim

### Elemento: Logótipo
- **Atributo:** `footer_show_logo`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Escondido
  - `1` → Visível

### Seleção país/idioma
- **Atributo:** `footer_hide_market_change`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Exibir
  - `1` → Esconder

### Footer country position
- **Atributo:** `footer_country_position`
- **Valor atual:** `1`

### ScrollTop
- **Atributo:** `scrollTopButton`
- **Valor atual:** `1`

### Newsletter submit
- **Atributo:** `footer_news_submit`
- **Valor atual:** `1`

### Newsletter layout
- **Atributo:** `footer_news_position_type`
- **Valor atual:** `0`

### Newsletter position
- **Atributo:** `footer_news_position`
- **Valor atual:** `0`

### Grid columns
- **Atributo:** `footer_grid_columns`
- **Valor atual:** `12`

---

## Templates base: footer - home

### Slider dots desktop
- **Atributo:** `homepage_slider_dots`
- **Valor atual:** `1`

### Slider arrows desktop
- **Atributo:** `homepage_slider_arrows`
- **Valor atual:** `1`

### Draggable
- **Atributo:** `homepage_draggable`
- **Valor atual:** `0`

### Slider speed
- **Atributo:** `homepage_slider_speed`
- **Valor atual:** `1300`

---

## Templates base: footer - product_list

### Área A
- **Atributo:** `list_area_a_version`
- **Valor atual:** `0`

### Área B
- **Atributo:** `list_area_b_version`
- **Valor atual:** `0`

### Área C
- **Atributo:** `list_area_c_version`
- **Valor atual:** `21`

### Área D
- **Atributo:** `list_area_d_version`
- **Valor atual:** `0`

### Filters layout desktop
- **Atributo:** `list_filters_layout`
- **Valor atual:** `2`

---

## Templates base: footer - product

### Área A
- **Atributo:** `detail_area_a_version`
- **Valor atual:** `22`

### Área B
- **Atributo:** `detail_area_b_version`
- **Valor atual:** `21`

### Área C
- **Atributo:** `detail_area_c_version`
- **Valor atual:** `21`

### Área D
- **Atributo:** `detail_area_d_version`
- **Valor atual:** `1`




---

## Templates base: blog

### Exibir heading no detalhe
- **Atributo:** `blog_detail_heading`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Sim

### Quantidade por linha
- **Atributo:** `blog_list_grid`
- **Valor atual:** `3`
- **Valores possíveis:** `2`, `3`

### Tags: Localização
- **Atributo:** `flags_position`
- **Valor atual:** `0`
- **Valores possíveis:**
  - `0` → Topo
  - `1` → Por cima do título

---

## Templates base: download

### Quantidade por linha
- **Atributo:** `downloads_prods_grid`
- **Valor atual:** `5`
- **Valores possíveis:** `3`, `4`, `5`

---

## Templates base: events

### Quantidade por linha
- **Atributo:** `events_list_qtd`
- **Valor atual:** `2`
- **Valores possíveis:** `2`, `3`, `4`

---

## Templates base: account

### Intro: Exibir Resumo
- **Atributo:** `myAccountIntroDisplaySummary`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Oculto
  - `1` → Visível

---

## Templates base: news

### Quantidade por linha
- **Atributo:** `news_list_qtd`
- **Valor atual:** `4`
- **Valores possíveis:** `2`, `3`, `4`

---

## Templates base: comparator

### Permitir adicionar ao carrinho
- **Atributo:** `product_add_cart_comparator`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Sim

---

## Templates base: shopbylook

### Quantidade por linha
- **Atributo:** `lookbook_list_qtd`
- **Valor atual:** `2`
- **Valores possíveis:** `2`, `3`

---

## Templates base: shopbylook_detail

### Quantidade por linha
- **Atributo:** `lookbook_prods_grid`
- **Valor atual:** `3`
- **Valores possíveis:** `3`, `4`, `5`

---

## Templates base: wishlist

### Permitir adicionar ao carrinho
- **Atributo:** `addCartByWishlist`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Sim

### Permitir partilhar
- **Atributo:** `wishlist_public`
- **Valor atual:** `1`
- **Valores possíveis:**
  - `0` → Não
  - `1` → Sim

### Permitir partilhar: Layout
- **Atributo:** `popup_share_version`
- **Valor atual:** `11`
- **Valores possíveis:**
  - `11` → Formulário
  - `12` → Redes sociais
  - `13` → Tooltip

### Quantidade por linha
- **Atributo:** `wishlist_prods_grid`
- **Valor atual:** `4`
- **Valores possíveis:** `3`, `4`, `5`

