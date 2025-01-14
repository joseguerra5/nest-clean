export class Slug {
  public value: string
  
  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }


  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      // pega todos os espaços em branco e troca por "-"
      .replace(/\s+/g, '-')
      // pega tudo que não são palavras e substitui por nada
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      // pega hífen no final da string e substitui por nada
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
