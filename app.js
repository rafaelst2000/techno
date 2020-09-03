const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: 'Item adicionado!',
    alertaAtivo: false,
    carrinhoAtivo: false
  },
  computed: {
    carrinhoTotal() {
      let total = 0
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco
        })
      }
      return total
    }
  },
  watch: {
    produto() {
      document.title = this.produto.nome || "Techno"
      const hash = this.produto.id || ""
      history.pushState(null, null, `#${hash}`)
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    }
  },
  filters: {
    numberToPrice(value) {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json").then(res => res.json()).then(res => {
        this.produtos = res
      })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`).then(res => res.json()).then(res => {
        this.produto = res
      })
    },
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false
    },
    abrirModal(id) {
      this.fetchProduto(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    adicionarItem() {
      this.produto.estoque--
      const { id, nome, preco } = this.produto
      this.carrinho.push({ id, nome, preco })
      this.alerta(`${nome} foi adicionado ao carrinho!`)
    },
    removerItem(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) this.carrinho = JSON.parse(window.localStorage.carrinho)
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false
      }, 1500)
    },
    router() {
      const hash = document.location.hash
      if (hash)
        this.fetchProduto(hash.replace("#", ""))
    }
  },
  created() {
    this.fetchProdutos()
    this.checarLocalStorage()
    this.router()
  },
})