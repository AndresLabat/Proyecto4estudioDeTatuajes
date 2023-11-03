<h1 align="center"># README - 🖌️Estudio de Tatuajes🖌️</h1>

__<p align="center">Proyecto 4 - Backend de un estudio de tatuajes - Semanas 7 y 8</p>__


<p align="center">Backend de un estudio de tatuajes, por Andrés Labat.
<br>
Desarrollado como parte del Bootcamp de Full Stack Developer de Geekshubs Academy.</p>

<p>
   <div align="center">
      <img src="./img README/geekhubs.png" style="max-width: 100%;" width="200">
   </div>    
</p>
<p>
   <div align="center">
      <em><b>Bienvenido a este backend</b></em>
   </div>   
<p align="center">_______________________________________________</p>

**Estudio de Tatuajes** es un proyecto que recrea el backend de un estudio de tatuajes utilizando node.js, typescript, express, mySQL, GIT y GitHub. Este proyecto incluye una base de datos relacional, así como diversos endpoints que te permiten registrarte, hacer login, acceder a la información almacenada en las tablas, e incluso actualizarla y borrarla.
<p>
   <div align="center">
      <img src="./img README/index img.jpeg" style="max-width: 100%">
   </div>    
</p>

## 📋 Contenido del Readme

<details>
  <summary>Apartados</summary>
<ol>
    <li><a href="#objetivo">Objetivo</a></li>
    <li><a href="#tecnologías-utilizadas">Tecnologías Utilizadas</a></li>
    <li><a href="#diagrama-bd">Diagrama BD</a></li>
    <li><a href="#ramas-del-repositorio">Ramas del Repositorio</a></li>
    <li><a href="#instrucciones-de-uso">Instrucciones de Uso</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#futuras-funcionalidades">Futuras Funcionalidades</a></li>
    <li><a href="#problemas-y-soluciones">Problemas y Soluciones</a></li>
    <li><a href="#deploy">Deploy</a></li>
    <li><a href="#cómo-contribuir">Cómo Contribuir</a></li>
    <li><a href="#autor">Autor</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
  </ol>
</details>

## 🎯 Objetivo {#objetivo}
Este proyecto requería una API funcional conectada a una base de datos con al menos una relación de uno a muchos y una relación de muchos a muchos. 

## 🔧 Tecnologías Utilizadas {#tecnologías-utilizadas}

<details>
<summary>Tecnologías</summary>

- **Typescript**: es el lenguaje de programación sobre el que se han montado el servidor y los distintos endpoints.
  <code><img width="5%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png"></code>

- **MySQL**: Es el sistema de gestión de bases de datos sobre el que se han construido las tablas en SQL.
 <code><img width="10%" src="https://www.vectorlogo.zone/logos/mysql/mysql-ar21.svg"></code>

- **Node**: Es una plataforma de tiempo de ejecución de JavaScript en el lado del servidor, se usa en combinación con typescript para crear servidores con un código más robusto y mantenible.
<code><img width="13%" src="https://upload.wikimedia.org/wikipedia/vi/a/a7/Nodejs_logo_light.png"></code>

- **Express**: Express proporciona una serie de características y herramientas que facilitan la creación de rutas, el manejo de solicitudes y respuestas, y la implementación de middleware para aplicaciones web.
    <code><img width="15%" src="https://cdn.buttercms.com/2q5r816LTo2uE9j7Ntic"></code>

- **Git**: Sistema de control de versiones para el seguimiento de cambios en el proyecto.
  <code><img width="10%" src="https://www.vectorlogo.zone/logos/git-scm/git-scm-ar21.svg"></code>

- **GitHub**: Plataforma para alojar el repositorio en línea y colaborar en el desarrollo del proyecto.
    <code><img width="6%" src="https://www.svgrepo.com/show/35001/github.svg"></code>

</details>

## 🏗️ Diagrama BD {#diagrama-bd}

Se establece que solo hay un rol por usuario, y que este es el que le da los privilegios para poder usar algunos endpoints o no, por otro lado, la tabla "users" almacena tanto los clientes como los trabajadores, que se unen en la citas, siendo esta última una tabla intermedia.
Además en cada cita se pueden realizar varios tatuajes o piercings y el mismo piercing o tatuaje realizarse en varias citas diferentes.
<p>
   <div align="center">
      <img src="./img README/reverse-engineer.jpeg" style="max-width: 100%">
   </div>    
</p>

## 🍃 Ramas del Repositorio {#ramas-del-repositorio}

Este proyecto se ha desarrollado en dos ramas. En la rama "dev" se ha realizado toda la lógica y todo lo referente a node.js, express y typescript y, por otro lado, en la rama "master" fue donde de inició el proyecto y donde finalmente se ha creado este README.

## ⚙️ Instrucciones de Uso {#instrucciones-de-uso}

<details>
<summary>Instrucciones</summary>

1. Clona este repositorio en tu máquina local usando el siguiente comando: `git clone [URL del repositorio]`.
2. A continuación instala todas las dependencias con el comando ` $ npm install `
3. Conectamos nuestro repositorio con la base de datos mediante las credenciales en el archivo db.ts o, en este caso, con las variables de entorno que se encuentran en el archivo .env

    ``` js
        PORT =   
        DB_HOST= 
        DB_USERNAME= ""
        DB_PASSWORD= ""
        DB_NAME=""
        DB_PORT=   
        
        //  Aqui además almacenamos el secreto del token  
        JWT_SECRET= ""
    ```  

4. Ejecutamos las migraciones mediante el comando `npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts` 
5. Si estamos en desarrollo, lo hacemos funcionar y actualizarse en tiempo real mediante el comando `npm run dev`
6. Si queremos compilar usamos el comando `npm run build`
7. Si estamos en producción, lo ponemos en marcha con el comando `npm run start`
8. Usamos los endpoints almacenados en la carpeta http para usar las distintas funcionalidades que se han diseñado.

</details>

## 👀 Endpoints {#endpoints}

<details>
<summary>Endpoints</summary>

- AUTH
    - REGISTER

            POST http://localhost:3000/api/register
        body:
        ``` js
            {
                "user": "David",
                "email": "david@david.com",
                "password": "princes"
            }
        ```

    - LOGIN

            POST http://localhost:3000/api/login  
        body:
        ``` js
            {
                "user": "David",
                "email": "david@david.com",
                "password": "princes"
            }
        ```
- RUTINAS
    - RECUPERAR RUTINAS  

            GET http://localhost:3000/api/rutina

    - ...
</details>

## 🚄 Futuras Funcionalidades {#futuras-funcionalidades}

Añadir el CRUD de portfolio:
- Get portfolio
- Create portfolio  
- Update portfolio  
- Delete portfolio

Crear un endpoint que permita añadir mas productos de portfolio a un appointment.
- Add product to the appointment


## ⚠️ Problemas y Soluciones {#problemas-y-soluciones}

### 1. Al crear las relaciones many to many entre dos tablas fuertes sin crear las one to many de la tabla intermedia a la fuerte.

- **🚧Problema**: Al crear las relaciones many to many entre dos tablas fuertes sin crear las one to many de la tabla intermedia a la fuerte no podía con una única búsqueda acceder a toda la información que necesitaba al estar en dos tablas distintas sin una relación directa creada.

   - **💡Solución**: establecer una relación one to many de las tablas fuertes a la intermedia, de forma que ahora con el nuevo atributo puedes acceder a toda la información de la tabla en forma de array y evitas hacer más de una consulta.

<p>
   <div align="center">
      <img src="img README/many-to-one.jpeg" style="max-width: 100%;" width="500">
   </div>    
   <div align="center">
      <em><b>Aqui se ve la relación many to one de la tabla intermedia a sus dos tablas fuertes</b></em>
   </div>   
</p>

### 2. Los endpoints contienen demasiadas líneas y demasiada lógica al tener muchos validadores.

- **🚧Problema**: cada endpoint contiene toda su lógica propia y todos los validadores de los datos de entrada, por lo que tienen mucha responsabilidad y ocupan demasiadas líneas de código.

   - **💡Solución**: abstraer los validadores a un archivo independiente llamado validations.ts e importarlos en los endpoints cuando son necesarios.

<p>
   <div align="center">
      <img src="img README/validations.jpeg" style="max-width: 100%;" width="500">
   </div>    
   <div align="center">
      <em><b>cada validador contiene su lógica y es exportado para su uso en los controladores</b></em>
   </div>   
</p>

## 🚀 Deploy {#deploy}

Por el momento su único uso es en local, en el futuro de realizará el deploy.

## 🤝 Cómo Contribuir {#cómo-contribuir}

Si deseas contribuir a este proyecto, puedes realizar un fork del repositorio en GitHub, hacer tus cambios y enviar una solicitud de extracción (pull request). Tu contribución será revisada y, si es apropiada, se fusionará con la rama principal.

1. Haz un fork de este repositorio.

2. Crea una nueva rama para tu contribución: `git checkout -b tu-nueva-caracteristica`.

3. Realiza tus cambios y commitea: `git commit -m "Añade una nueva característica"`.

4. Envía tus cambios al repositorio: `git push origin tu-nueva-caracteristica`.

5. Crea una solicitud de extracción en GitHub.

Espero que disfrutes explorando y utilizando este backend del estudio de tatuajes. Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto conmigo a través de la información de contacto proporcionada.

## 📝 Autor {#autor}

``` js
 const developer = "Andrés Labat Beltrán";

 console.log("Desarrollado por: " + developer);
```  

- **Nombre**: Andrés Labat Beltrán
- **Fecha de Comienzo del Proyecto**: 26/10/2023
- **Email**: andreslabat89@gmail.com.
<a href = "mailto:micorreoelectronico@gmail.com"><img src="https://img.shields.io/badge/Gmail-C6362C?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
- **Linkedin**: https://www.linkedin.com/in/andrés-labat-beltrán/.
<a href="https://www.linkedin.com/in/andrés-labat-beltrán/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 

## ⚖️ Licencia {#licencia}

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.

## 👏 Agradecimientos {#agradecimientos}

Agradecimentos a GeeksHubs Academy por los conocimientos que he podido adquirir estas cuatro semanas y que han hecho posible este proyecto, y a nuestros queridos profesores David Ochando y Dani Tarazona y su gran paciencia con nosotros.

<p>
   <div align="center">
      <img src="img README/geekhubs-con-fondo.png" style="max-width: 100%;" width="250">
   </div>    
</p>

Quiero hacer una mención especial a mi mujer, Alba, ya que sin su apoyo e inspiracion ni este ni ningún otro proyecto llegarían a ser una realidad.

¡Gracias por visitar **Estudio de tatuajes** y explorar mi proyecto!