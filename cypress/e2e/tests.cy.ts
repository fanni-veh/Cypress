
export {};

describe('Shopify Store Tests', () => {
  
  beforeEach(() => {
    cy.visit('https://r0971397-realbeans.myshopify.com')
    
    cy.url().then(url => {
      if (url.includes('/password')) {
        cy.get('#password').type('chifew') 
        cy.get('button[type="submit"]').click()
      }
    })

    cy.get('body').then($body => {
      if ($body.find('#shopify-pc_banner_btn-accept').length > 0) {
        cy.get('#shopify-pc_banner_btn-accept').click()
      }
    })
  })

  it('should display correct product items in catalog', () => {
    cy.get('#HeaderMenu-catalog').click()
    
    cy.get('.product-grid').should('be.visible')
    
    cy.get('.card-wrapper').should('have.length.at.least', 1)
    
    cy.get('.card__heading').should('contain.text', 'Blended coffee 5kg')
    cy.get('.card__heading').should('contain.text', 'Roasted coffee beans 5kg')
    
    cy.get('.card-wrapper').each(($product) => {
      cy.wrap($product).within(() => {
        cy.get('.card__heading').should('not.be.empty')
        cy.get('.price-item--regular').should('not.be.empty')
        cy.get('img').should('be.visible')
      })
    })
  })

  it('should sort products by price correctly', () => {
    cy.visit('https://r0971397-realbeans.myshopify.com/collections/all')
    
    cy.get('#product-grid').should('be.visible')
    
    cy.get('#SortBy').select('price-ascending')
    cy.wait(2000) 
    
    cy.get('.price-item--regular').then($prices => {
      const prices = []
      $prices.each((index, element) => {
        const priceText = Cypress.$(element).text()
        const price = parseFloat(priceText.replace(/[€$,From\s]/g, '').replace(/EUR.*/, ''))
        if (!isNaN(price)) {
          prices.push(price)
        }
      })
      
      const sortedPrices = [...prices].sort((a, b) => a - b)
      expect(prices).to.deep.equal(sortedPrices)
    })
    
    cy.get('#SortBy').select('price-descending')
    cy.wait(2000)
    
    cy.get('.price-item--regular').then($prices => {
      const prices = []
      $prices.each((index, element) => {
        const priceText = Cypress.$(element).text()
        const price = parseFloat(priceText.replace(/[€$,From\s]/g, '').replace(/EUR.*/, ''))
        if (!isNaN(price)) {
          prices.push(price)
        }
      })
      
      const sortedPrices = [...prices].sort((a, b) => b - a)
      expect(prices).to.deep.equal(sortedPrices)
    })
  })

  it('should display correct product information on detail pages', () => {
    cy.get('#HeaderMenu-catalog').click()
    cy.get('#CardLink-template--23889356751176__product-grid-9507940893000').click()

    cy.get('.product__title h1').scrollIntoView().should('be.visible')
    cy.get('.product__title h1').should('contain.text', 'Blended coffee 5kg')
    
    cy.get('.product__description').scrollIntoView().should('be.visible')
    cy.get('.product__description').should('contain.text', 'RealBeans coffee, ready to brew')
    
    cy.get('.price-item--regular').first().scrollIntoView().should('be.visible')
    cy.get('.price-item--regular').should('contain.text', '€55,00')
    
    cy.get(".product__media-zoom-lightbox").invoke('addClass','hidden');
    cy.get('.product__media img').scrollIntoView().should('be.visible')
    cy.get('.product__media img').should('have.attr', 'src')
    cy.get('.product__media img').should('have.attr', 'alt')
    
    cy.get('.product__media img').then($img => {
      const src = $img.attr('src')
      expect(src).to.include('RealBeansBlendBag')
    })

    cy.get('#HeaderMenu-catalog').click()
    cy.get('#CardLink-template--23889356751176__product-grid-9507932143944').click()
    
    cy.get('.product__title h1').should('contain.text', 'Roasted coffee beans 5kg')
    cy.get('.product__description').should('contain.text', 'Our best and sustainable real roasted beans.')
    cy.get('.price-item--regular').should('contain.text', '€40,00')
    cy.get('.product__media img').then($img => {
      const src = $img.attr('src')
      expect(src).to.include('RealBeansRoastedBag')
    })
  })

  it('should display correct intro text and product list on homepage', () => {
    cy.get('.rich-text__text').should('be.visible')
    cy.get('.rich-text__text').should('contain.text', 'Since 1801, RealBeans has roasted premium coffee')

    cy.contains('Blended coffee 5kg').should('exist');
    cy.contains('Roasted coffee beans 5kg').should('exist');
  })

  it('should display the history paragraph on About page', () => {
    cy.get('#HeaderMenu-about').click()
    
    cy.get('main').should('be.visible')
    cy.get('h1, .page-title').should('be.visible')
    cy.get('.rte').should('contain.text',
      'From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.'
    );
  })
})
