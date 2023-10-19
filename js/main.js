//Banco de dados
const db = []

// Referenciando os elementos do html
const modal = document.getElementById('modal')
const openCreateLoginModalButton = document.getElementById('criar-conta')
const openListUserModalButton = document.getElementById('listar-usuarios')
const closeModalButton = document.getElementById('closeModal')

// configurando os botoes para abrir e fechar modal de criação de usuário
openCreateLoginModalButton.addEventListener('click', () => {
  criarUsuarioModal.style.display = 'block'
})
closeModalButton.addEventListener('click', () => {
  criarUsuarioModal.style.display = 'none'
  User.clearCreateAccountForm()
})


// Definindo a classe User para receber o nome, o nome de usuário, a senha e a permissão
class User {
  constructor(name, user, password, permission) {
    this.name = name
    this.user = user
    this.password = password
    this.permission = permission
  }

  static login(inputUser, inputPassword, db) {
    const user = db.find(({ user }) => user === inputUser)

    if (user) {
      if (User.verifyPassword(inputPassword, user.password)) {
        return `Bem-vindo ${user.name}`
      }
    }

    return 'Usuário ou senha incorreta'
  }

  // Criptografando a senha
  static hashPassword(password) {
    let hash = 0
    for (let i = 0 ;i < password.length ;i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
    }
    return hash.toString()
  }

  static verifyPassword(inputPassword, hashedPassword) {
    return User.hashPassword(inputPassword) === hashedPassword
  }

  // Método para criar usuário
  static createUser(inputName, inputUser, inputPassword, inputPermission, db) {
    const erros = []
    const alfaNum = (password) => {
      const existletra = /[a-zA-Z]/.test(password)
      const existnumero = /[0-9]/.test(password)
      return existletra && existnumero
    }
    const alreadyExistUser = db.filter(({ user }) => user === inputUser)

    if (alreadyExistUser.length > 0) {
      erros.push('Esse usuário já está sendo utilizado')
    }

    if (inputPassword.length < 5) {
      erros.push('A senha precisa ter mais do que 5 caracteres')
    }
    if (!alfaNum(inputPassword)) {
      erros.push('A senha precisa ter pelo menos um número e uma letra')
    }
    //Ajustar os erros e listar com algum tipo de separador
    if (erros.length > 0) {
      const listaErros = erros.map((erro, index) => `Erro ${index + 1}-${erro}`)
      return `\n${listaErros}`
    }
    const hashedPassword = User.hashPassword(inputPassword)
    const newUser = new User(inputName, inputUser, hashedPassword, inputPermission)
    db.push(newUser)
    return `Criação de usuário concluída, Bem-vindo ${inputName}`
  }

  // Método para limpar os campos do formulário de criação de conta
  static clearCreateAccountForm() {
    const inputName = document.querySelector('#nome')
    const inputUser = document.querySelector('#usuario')
    const inputPassword = document.querySelector('#senha')
    const inputPermission = document.querySelector('#permissao')
    const inputPasswordCheck = document.querySelector('#confirmar-senha')
    const createAccountResult = document.getElementById('createAccountResult')

    inputName.value = ''
    inputUser.value = ''
    inputPassword.value = ''
    inputPermission.value = ''
    inputPasswordCheck.value = ''
    createAccountResult.textContent = ''
  }
}

// Buscando os dados para criação do usuario
const formCreateUser = document.getElementById('accountForm')


// Buscando os dados para login do usuario
const formLoginUser = document.getElementById('loginForm')

// Função para o envio dos formulários de criação de conta
function getFormInputs(event) {
  event.preventDefault()

  const inputName = event.target.querySelector('#nome').value
  const inputUser = event.target.querySelector('#usuario').value
  const inputPassword = event.target.querySelector('#senha').value
  const inputConfirmPassword = event.target.querySelector('#confirmar-senha').value;
  const inputPermission = event.target.querySelector('#permissao').value

  if (inputPassword !== inputConfirmPassword) {
    const createAccountResult = document.getElementById('createAccountResult');
    createAccountResult.textContent = 'A senha e a confirmação da senha não coincidem.';
    return;
  }

  const createUserResult = User.createUser(inputName, inputUser, inputPassword, inputPermission, db);

  const createAccountResult = document.getElementById('createAccountResult');
  createAccountResult.textContent = createUserResult;
}


//Função para o envio dos formulários de login da conta
function getLoginInputs(event) {
  event.preventDefault()
  const inputUser = event.target.querySelector('#inputUser').value
  const inputPassword = event.target.querySelector('#inputPassword').value

  const loginUserResult = User.login(inputUser, inputPassword, db)

  const loginResult = document.getElementById('loginResult')
  loginResult.textContent = loginUserResult
}

// Adicionando ouvinte de evento ao formulário de criação de conta
formCreateUser.addEventListener('submit', getFormInputs)

// Adicionando ouvinte de evento ao formulário de login do usuario
formLoginUser.addEventListener('submit', getLoginInputs)



