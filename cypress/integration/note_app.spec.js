describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Alan Da Silva',
      username: 'alandsilva',
      password: 'secret',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
  });
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('alandsilva');
      cy.get('#password').type('secret');
      cy.get('#login-button').click();

      cy.contains('Alan Da Silva logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('alandsilva');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .contains('Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'Alan Da Silva logged in');
    });
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'alandsilva', password: 'secret' });
    });

    it('blog form can be opened', function () {
      cy.contains('create Blog').click();
      cy.contains('title');
      cy.contains('author');
      cy.contains('url');
    });

    it('a blog can be created', function () {
      cy.contains('create Blog').click();
      cy.get('#title').type('Test Title');
      cy.get('#author').type('Test Author');
      cy.get('#url').type('testurl.com');
      cy.get('#blogform-button').click();

      cy.contains('Test Title Test Author');
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Test title',
          author: 'Test Author',
          url: 'testurl.com',
        });
      });

      it('it can be expanded', () => {
        cy.contains('show').click();
        cy.get('.detailsContent').contains('testurl.com');
        cy.contains('likes 0');
      });

      it('it can be liked', () => {
        cy.contains('show').click();
        cy.contains('like').click();

        cy.contains('likes 1');
      });

      it('it can be deleted', () => {
        cy.contains('show').click();
        cy.contains('remove').click();

        cy.get('html').should('not.contain', 'Test title');
      });
    });

    describe('and a few blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'First title',
          author: 'First Author',
          url: 'firsturl.com',
          likes: 4,
        });
        cy.createBlog({
          title: 'Second title',
          author: 'Second Author',
          url: 'secondurl.com',
          likes: 9,
        });
        cy.createBlog({
          title: 'Third title',
          author: 'Third Author',
          url: 'thirdurl.com',
          likes: 2,
        });
      });

      it('blogs are ordered by likes', function () {
        let array = [];
        cy.get('.like-value')
          .each(function ($el) {
            array.push(parseInt($el.text()));
          })
          .then(function () {
            expect(array).to.deep.equal(
              [...array].sort(function (a, b) {
                return b - a;
              })
            );
          });
      });
    });
  });
});
