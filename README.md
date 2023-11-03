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
      <img src="./img README/index img.jpeg" style="max-width: 100%;" width="400">
   </div>    
</p>

## 📋 Contenido del Readme

<details>
  <summary>Apartados del readme</summary>
  <ol>
    <li><a href="#objetivo">Objetivo</a></li>
    <li><a href="#sobre-el-proyecto">Sobre el proyecto</a></li>
    <li><a href="#deploy-🚀">Deploy</a></li>
    <li><a href="#stack">Stack</a></li>
    <li><a href="#diagrama-bd">Diagrama</a></li>
    <li><a href="#instalación-en-local">Instalación</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#futuras-funcionalidades">Futuras funcionalidades</a></li>
    <li><a href="#contribuciones">Contribuciones</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#webgrafia">Webgrafia</a></li>
    <li><a href="#desarrollo">Desarrollo</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
    <li><a href="#contacto">Contacto</a></li>
  </ol>
</details>

## 🎯Objetivo
Este proyecto requería una API funcional conectada a una base de datos con al menos una relación de uno a muchos y una relación de muchos a muchos.

## Sobre el proyecto
Decidí crear una aplicación web para ayudar a los amantes del gimnasio, que les permitiría crear y realizar un seguimiento de nuevas rutinas para sus ejercicios diarios. He visto muchas apps de este estilo pero ninguna que nos permita cambiar tan libremente las rutinas adaptandolas a nuestras necesidades.    

## Deploy 🚀
<div align="center">
    <a href="https://www.google.com"><strong>Url a producción </strong></a>🚀🚀🚀
</div>

## Stack
Tecnologías utilizadas:
<div align="center">
<a href="https://www.mongodb.com/">
    <img src= "https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
</a>
<a href="https://www.expressjs.com/">
    <img src= "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
</a>
<a href="https://nodejs.org/es/">
    <img src= "https://img.shields.io/badge/node.js-026E00?style=for-the-badge&logo=node.js&logoColor=white"/>
</a>
<a href="https://developer.mozilla.org/es/docs/Web/JavaScript">
    <img src= "https://img.shields.io/badge/javascipt-EFD81D?style=for-the-badge&logo=javascript&logoColor=black"/>
</a>
 </div>


## Diagrama BD
!['imagen-db'](./images/sampleDb.png)

## Instalación en local
1. Clonar el repositorio
2. ` $ npm install `
3. Conectamos nuestro repositorio con la base de datos 
4. ``` $ Ejecutamos las migraciones ``` 
5. ``` $ Ejecutamos los seeders ``` 
6. ``` $ npm run dev ``` 
7. ...

## Endpoints
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

## Futuras funcionalidades
[ ] Añadir create book  
[ ] Añadir logs  con winston  
[ ] Validaciones de la solicitud con express-validator  
[ ] ...


## Desarrollo:

``` js
 const developer = "Andrés Labat";

 console.log("Desarrollado por: " + developer);
```  

## 🤝 Cómo Contribuir

Si deseas contribuir a este proyecto, puedes realizar un fork del repositorio en GitHub, hacer tus cambios y enviar una solicitud de extracción (pull request). Tu contribución será revisada y, si es apropiada, se fusionará con la rama principal.

1. Haz un fork de este repositorio.

2. Crea una nueva rama para tu contribución: `git checkout -b tu-nueva-caracteristica`.

3. Realiza tus cambios y commitea: `git commit -m "Añade una nueva característica"`.

4. Envía tus cambios al repositorio: `git push origin tu-nueva-caracteristica`.

5. Crea una solicitud de extracción en GitHub.

Espero que disfrutes explorando y utilizando este backend del estudio de tatuajes. Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto conmigo a través de la información de contacto proporcionada.

## 📝Autor

- **Nombre**: Andrés Labat Beltrán
- **Fecha de Comienzo del Proyecto**: 26/10/2023
- **Email**: andreslabat89@gmail.com.
<a href = "mailto:micorreoelectronico@gmail.com"><img src="https://img.shields.io/badge/Gmail-C6362C?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
- **Linkedin**: https://www.linkedin.com/in/andrés-labat-beltrán/.
<a href="https://www.linkedin.com/in/andrés-labat-beltrán/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 

## ⚖️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.

## 👏Agradecimientos

Agradecimentos a GeeksHubs Academy por los conocimientos que he podido adquirir estas cuatro semanas y que han hecho posible este proyecto, y a nuestros queridos profesores David Ochando y Dani Tarazona y su gran paciencia con nosotros.

<p>
   <div align="center">
      <img src="img README/geekhubs-con-fondo.png" style="max-width: 100%;" width="250">
   </div>    
</p>

Quiero hacer una mención especial a mi mujer, Alba, ya que sin su apoyo e inspiracion ni este ni ningún otro proyecto llegarían a ser una realidad.

¡Gracias por visitar **Estudio de tatuajes** y explorar mi proyecto!
</p>