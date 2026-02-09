Sistema fullstack para gestão de produção, controle de inventário e planejamento de materiais.

Nota sobre o Deploy:

Não foi possível disponibilizar o build da aplicação devido a dificuldades técnicas no processo de deploy do backend, relacionadas à configuração do ambiente de execução.
No entanto, todo o código-fonte está funcional e disponível no repositório, podendo ser executado localmente conforme instruções do projeto.

Tech Stack:
Client: - React.js + Vite
TailwindCSS (Estilização)
Axios (Integração API)
Lucide-React (Ícones)
Redux Toolkit (Gerenciamento de Estado)

Server: - Java 17
Quarkus Framework
Hibernate ORM (Panache)
JUnit 5 (Testes)

Database: 
PostgreSQL (Pronto para Produção)

Como Rodar Localmente
Siga estas instruções para ter uma cópia do projeto rodando em sua máquina.

Pré-requisitos
Java JDK 17 ou superior
Node.js 18 ou superior
Git

1. Clonar o repositório
git clone https://github.com/Frois2/ProductManager
cd ProductManager

Rodar o Backend:
cd backend
./mvnw quarkus:dev

Rodar o frontend:
cd frontend
npm install
npm run dev

Rodar teste:
npx cypress open
npx cypress run

Instalações que fiz durante o percurso:
npm create vite@latest inventory-frontend -- --template react
npm install react react-dom react-router-dom axios react-redux @reduxjs/toolkit react-hot-toast framer-motion lucide-react tailwindcss postcss autoprefixer
npm install -D tailwindcss@3.4.17 postcss autoprefixer --legacy-peer-deps
npm install -D @testing-library/dom --legacy-peer-deps
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom --legacy-peer-deps
npm install cypress --save-dev --legacy-peer-deps
mvn io.quarkus.platform:quarkus-maven-plugin:3.6.0:create -DprojectGroupId=com.autoflex -DprojectArtifactId=backend
./mvnw quarkus:add-extension -Dextensions="resteasy-reactive-jackson, hibernate-orm-panache, jdbc-postgresql, jdbc-h2, hibernate-validator"
npm install cypress --save-dev
npx cypress open
npx cypress run

Desenvolvido por Fernanda Frois
CONTATO :froisf22@gmail.com
