FROM httpd:2.4
WORKDIR /usr/local/apache2/htdocs/
COPY ./ ./ 
EXPOSE 80

# Instrucciones de ejecución del Dockfile:
    # 1. Desde la raíz del proyecto, utilizar los siguientes comandos:
        # a. docker build -t servidor-apache .
        # b. docker run -d -p 8080:80 --name prueba-reto6 servidor-apache
    # 2. Ir al navegador web y dirigirse a: http://localhost:8080