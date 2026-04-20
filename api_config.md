# Documentação de Configuração da API (`api_config.php`)

## Visão Geral

Este documento fornece uma referência detalhada para o ficheiro `api_config.php`, que gere as configurações críticas da plataforma. Estas definições controlam o comportamento da aplicação (APP), gestão de cache, otimização de imagens, lógica de listagem e parâmetros específicos de templates HTML.

**⚠️ Aviso de Segurança:** Este ficheiro contém chaves de API e identificadores sensíveis. Qualquer alteração em ambiente de produção deve ser validada e testada rigorosamente.

## Blocos Funcionais

### 1. Núcleo e Versão
- **`$API_VERSION`**: `202505` - Define a versão base da API para controlo de compatibilidade.
- **`$VERSAO_TEMPLATES`**: `1` - Ativa o novo funil de estilos.
- **`$VERSAO_EMAILS_MA`**: `1` - Versão dos emails de Marketing Automation.

### 2. Configuração de Aplicação (APP)
- **`$APP`**: `0` (Desativado), `1` (PWA), `2` (APP nativa).
- **`$APP_LINKING`**: Identificador de abertura (ex: `com.mysite.app`).
- **`$APP_APPLE_STORE_ID`** / **`$APP_PLAY_STORE_ID`**: Identificadores oficiais nas lojas.
- **WonderPush**: Configurações de notificações push (`$APP_WONDERPUSH_APIKEY`, `$APP_WONDERPUSH_ACCESS`).

### 3. Layout e Grelha (Desktop & Mobile)
- **`$LIST_GRID`**: `4` - Colunas padrão em desktop para listagem e pesquisa.
- **`$LIST_MOBILE_GRID`**: `2` - Colunas em mobile (1 ou 2).
- **`$WISH_MOBILE_GRID`**: `2` - Colunas na Wishlist em mobile.
- **Sessões**: O código inicializa `$_SESSION['GridView']` e `$_SESSION['GridViewMobile']` com estes valores se não estiverem definidos.

### 4. Gestão de Cache (Tempos em Minutos)
- **`$CACHE_HEADER_FOOTER`**: `60`
- **`$CACHE_DETALHE` / `$CACHE_HOME` / `$CACHE_QUERY_PRODUTOS` / `$CACHE_LISTA_PRODUTOS`**: `15`

### 5. Lógica de Negócio e Produtos
- **Preços e Leilões**:
  - `$API_CONFIG_IGNORAR_PRECOS_VISUALIZADOS = 1`
  - `$API_CONFIG_COM_LEILAO = 1`
  - `$API_CONFIG_FORCAR_REDIRECT_PRODUTO = 1`
- **Metatags**: `$META_HIDE_SITENAME` e `$META_HIDE_SKU_GROUP` (0 para concatenar nome do site).
- **Fidelização**: `$TEMPO_PONTOS_CADUCAR = 6` (meses).

### 6. Pesquisa e SOLR
- **`$SOLR`**: `0` (Desativado) ou `1` (Ativo).
- **`$PESQUISA_SKUS_DIRECTOS`**: `1` - Permite pesquisa direta por SKU.
- **`$filters_convert`**: Array de mapeamento de filtros (ex: `familia` => `family`).

### 7. Configurações de Imagem (`$CONFIG_IMAGE_SIZE`)
Define dimensões e tipo de corte (1: stretch, 2: crop, 3: fit) para diferentes contextos:
- **Default**: `large (1920px)`, `regular (1440px)`, `small (960px)`, `thumb (240px)`.
- **Blog**: Otimizado para rácio 3:2 (ex: `large: 1440x960`).
- **Produto**: Otimizado para rácio 3:4 (ex: `large: 1440x1920`, `regular: 810x1080`).
- **Home**: Banners desktop (`1920px`) e mobile (`1440px`).

### 8. Parâmetros de Template (`$CONFIG_TEMPLATES_PARAMS`)
Array extenso que controla componentes visuais:
- **Reviews**: Versão (`2`), permissão (`detail_allow_review`), e se é por cor (`review_by_sku_family_color`).
- **Banners**: Controlos de `autoplay`, `speed`, `arrows`, `dots` e `draggable` diferenciados por dispositivo.
- **Detalhe de Produto**: Ativação de `last_viewed`, sliders mobile (`relacionados_slider_mobile`), e versões de zoom (`zoom_detail_version`).
- **Mapas**: Chave Google Maps (`google_maps_key`) e servidor de tiles (`tile_map_server`).

## Impacto de Alterações

| Variável | Impacto |
| :--- | :--- |
| `$LIST_GRID` | Altera imediatamente a densidade de produtos na listagem desktop. |
| `$CACHE_*` | Valores baixos aumentam carga no servidor; valores altos atrasam atualizações de conteúdo. |
| `$CONFIG_IMAGE_SIZE` | Alterar dimensões requer regeneração de cache de imagens para evitar distorção. |
| `$SOLR` | Se ativado sem servidor configurado, a pesquisa deixará de funcionar. |

## Regras de Consistência para Agentes

1.  **Sincronização**: Ao alterar `$CONFIG_RELACIONADOS_QTD`, verifica se `$CONFIG_COMBINADOS_QTD` e outros relacionados devem ser atualizados.
2.  **Rácios de Imagem**: Mantém a consistência dos rácios ao sugerir novas dimensões em `$CONFIG_IMAGE_SIZE`.
3.  **Segurança**: Nunca removas ou alteres `$VALIDAR_TIPO_CLIENTE` sem entender o fluxo de autenticação da sessão.
4.  **Mobile First**: Ao ajustar `$LIST_MOBILE_GRID`, valida se o componente de frontend suporta a alteração (1 vs 2 colunas).
