const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: 'Item adicionado!',
    alertaAtivo: false,
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
    }
  },
  created() {
    this.fetchProdutos()
    this.checarLocalStorage()
  },
})