import PrismicDOM from 'prismic-dom'

export default {
  data () {
    return {}
  },
  methods: {
    renderRichText (data) {
      return PrismicDOM.RichText.asHtml(data)
    }
  }
}