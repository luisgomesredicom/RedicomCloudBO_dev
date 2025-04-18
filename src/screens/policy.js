import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import { Text } from 'react-native-paper'
import { theme } from '../styles/styles'
import { LoadingFullscreen } from '../components/elements';

export function PolicyScreen() {
  const [pageStatus, setPageStatus] = useState(0);

  useEffect(() => {
    setPageStatus(1);
  }, []);

  return (
    <SafeAreaView style={theme.safeAreaView}>
      <StatusBar barStyle='default'/>
        <View style={[theme.wrapperPage]}>
            {
                pageStatus > 0 ? (
                    <>
                        <View style={{backgroundColor: theme.colors.darktheme,position: 'absolute',top: 0,left: 0,width: '100%',height: 300,zIndex: 0}}></View>
                        
                        <ScrollView style={theme.wrapperPage} contentContainerStyle={theme.wrapperContentStyle}>
                        
                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Política de Privacidade do serviço Redicom Commerce Cloud{'\n'}</Text>
                            
                            <Text style={theme.paragraph}>
                            Para receber informações sobre os seus Dados Pessoais, as finalidades e as partes com as quais os Dados são partilhados, deverá contactar o Proprietário.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Proprietário e Responsável pelo Tratamento{'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Tipos de Dados recolhidos{'\n'}</Text>
                            <Text style={theme.paragraph}>O Proprietário não disponibiliza uma lista dos tipos de Dados Pessoais recolhidos.{'\n'}</Text>

                            <Text style={theme.paragraph}>
                            É fornecida informação completa sobre cada tipo de Dados Pessoais recolhidos nas respetivas secções da presente política de privacidade ou através de textos explicativos específicos apresentados antes da recolha de Dados. Os Dados Pessoais poderão ser facultados gratuitamente pelo Utilizador, ou, no caso dos Dados de Utilização, recolhidos automaticamente ao utilizar esta Aplicação.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            Salvo indicação em contrário, todos os Dados solicitados por esta Aplicação são obrigatórios, podendo a falta de disponibilização dos mesmos impossibilitar que esta Aplicação preste os seus serviços. No caso de esta Aplicação indicar especificamente que alguns Dados não são obrigatórios, o Utilizador pode optar por não comunicar tais Dados sem que tal afete a disponibilidade ou o funcionamento do Serviço. No caso de o Utilizador ter dúvidas sobre quais os Dados Pessoais obrigatórios poderá entrar em contacto com o Proprietário.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Modo e local de tratamento dos Dados{'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Métodos de tratamento{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            O Proprietário adotará medidas de segurança adequadas para impedir o acesso não autorizado, a divulgação, a modificação ou a destruição não autorizada dos Dados. O tratamento de Dados é realizado através de computadores e/ou ferramentas informáticas habilitadas para o efeito, seguindo procedimentos organizacionais e modos estritamente relacionados com as finalidades indicadas. Para além do Proprietário, em alguns casos, os Dados poderão ser acessíveis a certos tipos de pessoas responsáveis que estejam envolvidas no funcionamento deste serviço (esta Aplicação) (administração, vendas, marketing, departamento jurídico, gestão do sistema) ou a partes externas (tais como terceiros prestadores de serviços técnicos, transportadoras de correio, fornecedores de alojamento, empresas de informática, agências de comunicação), nomeadas como Subcontratantes pelo Proprietário, se necessário. A lista atualizada destas partes pode ser solicitada ao Proprietário a qualquer momento.
                            {'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Local{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Os Dados são tratados nos escritórios com atividade do Proprietário e em quaisquer outros locais onde as partes envolvidas no tratamento estejam localizadas.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            Dependendo da localização do Utilizador, as transferências de dados poderão implicar a transferência dos Dados do Utilizador para um país que não o seu. Para saber mais sobre o local do tratamento de tais Dados transferidos, o Utilizador pode consultar a secção relativa a informações sobre o tratamento de Dados Pessoais.
                            {'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Período de conservação{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Salvo indicação em contrário no presente documento, os Dados Pessoais serão processados e armazenados durante o tempo exigido pela finalidade para que foram recolhidos, podendo ser retidos por mais tempo devido a obrigações legais aplicáveis ou com base no consentimento dos Utilizadores.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Informação adicional para o Utilizador{'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Fundamento jurídico do tratamento{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            O Proprietário poderá proceder ao tratamento de Dados Pessoais relativos ao Utilizador caso se aplique uma das seguintes situações:
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            - O Utilizador prestou o seu consentimento para uma ou mais finalidades específicas.
                            - A disponibilização de Dados é necessária para o cumprimento de um contrato com o Utilizador e/ou para quaisquer obrigações pré-contratuais do mesmo;
                            - O tratamento é necessário para o cumprimento de uma obrigação legal à qual o Proprietário esteja sujeito;
                            - O tratamento está relacionado com uma tarefa realizada em função do interesse público ou no exercício de poderes oficiais atribuídos ao Proprietário;
                            - O tratamento é necessário para efeitos de interesses legítimos prosseguidos pelo Proprietário ou por qualquer terceiro.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            Em qualquer caso, o Proprietário colaborará na clarificação do fundamento jurídico específico que se aplica ao tratamento e, nomeadamente, se a disponibilização de Dados Pessoais consiste num requisito legal ou contratual, ou num requisito necessário para celebrar um contrato.
                            {'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Informação adicional sobre o período de conservação{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Salvo indicação em contrário no presente documento, os Dados Pessoais serão processados e armazenados durante o tempo exigido pela finalidade para que foram recolhidos, podendo ser retidos por mais tempo devido a obrigações legais aplicáveis ou com base no consentimento dos Utilizadores.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            Assim:{'\n'}
                            - Os Dados Pessoais recolhidos para finalidades relacionadas com o cumprimento de um contrato entre o Proprietário e o Utilizador serão conservados até que tal contrato tenha sido integralmente cumprido.
                            - Os Dados Pessoais recolhidos para finalidades dos interesses legítimos do Proprietário serão conservados pelo período necessário para satisfazer tais finalidades. O Utilizador poderá encontrar informações específicas relativas aos interesses legítimos prosseguidos pelo Proprietário nas respetivas secções do presente documento ou contactando o Proprietário.
                            - O Proprietário poderá conservar os Dados Pessoais por um período mais longo se o Utilizador tiver prestado o seu consentimento para tal tratamento, desde que tal consentimento não seja retirado. Além disso, o Proprietário poderá ser obrigado a conservar os Dados Pessoais por um período mais longo sempre que tal lhe seja exigido para o cumprimento de uma obrigação legal ou por ordem de uma autoridade.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            Assim que o período de conservação terminar, os Dados Pessoais serão apagados. Desse modo, os direitos de acesso, apagamento, retificação e portabilidade dos dados não podem ser exercidos após o termo do período de conservação.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Direitos do Utilizador de acordo com o Regulamento Geral sobre a Proteção de Dados (RGPD){'\n'}</Text>
                            <Text style={theme.paragraph}>
                            O Utilizador poderá exercer determinados direitos relativamente aos seus Dados tratados pelo Proprietário.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            O Utilizador tem o direito de, nomeadamente, na medida permitida pela lei:
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>- Retirar o seu consentimento a qualquer momento. O Utilizador tem o direito de retirar o consentimento no caso de ter previamente prestado o seu consentimento para o tratamento dos seus Dados Pessoais.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Opor-se ao tratamento dos seus Dados. O Utilizador tem o direito de se opor ao tratamento dos seus Dados se o tratamento for realizado com base num fundamento jurídico diferente do consentido.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Aceder aos seus Dados. O Utilizador tem o direito de saber se os Dados estão a ser tratados pelo Proprietário, de obter informação relativa a determinados aspetos do tratamento e de obter uma cópia dos Dados em fase de tratamento.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Verificar e procurar a retificação dos Dados. O Utilizador tem o direito de verificar a exatidão dos seus Dados e de solicitar que os mesmos sejam atualizados ou corrigidos.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Restringir o tratamento dos seus Dados. O Utilizador tem o direito de restringir o tratamento dos seus Dados. Neste caso, o Proprietário não tratará os seus Dados para qualquer finalidade que não a sua conservação.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Exigir o apagamento ou eliminação dos seus Dados Pessoais. O Utilizador tem o direito de exigir que o Proprietário apague os seus Dados.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Receber os seus Dados e de os transferir para outro responsável pelo tratamento. O Utilizador tem o direito de receber os seus Dados num formato estruturado, comummente utilizado e num formato que permita a sua leitura eletrónica, e de, quando tecnicamente possível, os transmitir a outro responsável pelo tratamento sem qualquer impedimento.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Apresentar uma reclamação. O Utilizador tem o direito de apresentar uma reclamação junto da respetiva autoridade de proteção de dados competente.{'\n'}</Text>
                            <Text style={theme.paragraph}>- Os Utilizadores também têm o direito de aprender sobre a base legal para as transferências de Dados para o estrangeiro, incluindo para qualquer organização internacional regida pelo direito internacional público ou criada por dois ou mais países, como a ONU, e sobre as medidas de segurança tomadas pelo Proprietário para salvaguardar os seus Dados.{'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Informações sobre o direito de oposição ao tratamento{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Quando os Dados Pessoais são tratados devido a um interesse público, no exercício de poderes oficiais atribuídos ao Proprietário ou para as finalidades dos interesses legítimos prosseguidos pelo Proprietário, o Utilizador poderá opor-se a tal tratamento apresentando uma razão relativa à sua situação específica para justificar a oposição.
                            {'\n'}</Text>

                            <Text style={theme.paragraph}>
                            No entanto, alerta-se o Utilizador para que, no caso de os seus Dados Pessoais serem tratados para finalidades de comercialização direta, poderá opor-se a tal tratamento a qualquer momento, a título gratuito e, sem apresentar qualquer justificação. Quando o Utilizador se opuser ao tratamento para finalidades de comercialização direta, os Dados Pessoais não serão tratados para tais finalidades. Para saber se o Proprietário se encontra a tratar Dados Pessoais para finalidades de comercialização direta, o Utilizador poderá consultar as secções relevantes do presente documento.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Como exercer estes direitos{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Qualquer pedido para exercer direitos do Utilizador poderá ser dirigido ao Proprietário através das informações de contacto indicadas no presente documento. Tais pedidos são gratuitos, os quais serão objeto de resposta pelo Proprietário o mais rapidamente possível e sempre no prazo de um mês, fornecendo ao Utilizador a informação exigida por lei. Qualquer retificação ou apagamento de Dados Pessoais ou restrição do tratamento será comunicada pelo Proprietário a cada destinatário, se houver, a quem os Dados Pessoais tenham sido divulgados, a menos que tal se revele impossível ou implique um esforço desproporcionado. A pedido do Utilizador, o Proprietário informará o mesmo sobre tais destinatários.
                            {'\n'}</Text>

                            <Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Informações adicionais sobre a recolha e tratamento de Dados{'\n'}</Text>

                            <Text style={theme.listNavSubtitle}>Ações judiciais{'\n'}</Text>
                            <Text style={theme.paragraph}>
                            Os Dados Pessoais do Utilizador poderão ser utilizados para fins legais pelo Proprietário, em Tribunal ou nas etapas conducentes a uma eventual ação judicial decorrente da utilização indevida deste serviço (esta Aplicação) ou de Serviços relacionados. O Utilizador declara ter conhecimento de que o Proprietário poderá ser obrigado a revelar dados pessoais a pedido das autoridades governamentais.
                            </Text>

                        </ScrollView>
                    </>
                ) : <LoadingFullscreen />
            }
        </View>
    </SafeAreaView>
  );
}