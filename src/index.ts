import setupServer from './app'

setupServer()
  .then(({ server }) => {
    const port = process.env.PORT
    const host = process.env.HOST || 'localhost'

    server.listen(
      {
        port: process.env.PORT ? parseInt(process.env.PORT) : 5001,
        host: process.env.HOST ? process.env.HOST : '0.0.0.0'
      },
      err => {
        if (err != null) {
          console.error(err)
          process.exit(1)
        }
        console.log(`Server ready at http://${process.env.HOST}:${process.env.PORT}`)
      }
    )
  })
  .catch(err => {
    console.error('Error: ', err)
  })

// TODO - Implementar integração com cognito ou firebase
// TODO - Criar paginação
// TODO - Criar validação para cpf
// TODO - Criar validação para cadastro de usuários
// TODO - Incluir try catch em todos os endpoints
// TODO - Ajustar os tratamentos de erro
// TODO - Criar endpoints Planos
// TODO - Incluir nos arquivos route os parametros aceitos em cada endpoint (busca por id, name, cpf, etc)
// TODO - Organizar toda a estrutura dos schemas (schemas genêricos)
// TODO - Validar se o personal trainer não está criando um registro de treino como membro
// TODO - Validar se o treino no registro de treino pertence ao member e ao personal trainer
// TODO - Criar possibilidade de transferência de treino para outro personal trainer
// TODO - Adicionar validação para verificar se o registro do treino está sendo salvo para o member correto
// TODO - Criar regra de negócio para verificar se o número de aulas do mês ultrapassa a quantidade de aula que o aluno tem direito
// TODO - Adicionar o nome dos query path (id --> personal_traine_id, member_id, etc)
// TODO - Criar método para reset de senha (apenas se não integrar com o firebase)
// TODO - Refatorar querys complexas utilizando o $executeRaw
