FROM python:3.9-slim

WORKDIR /app

RUN pip install flask

COPY css/ ./css/
COPY conf/ ./conf/
COPY app.py ./app.py
COPY datos/ ./datos/
COPY 13852255/ ./13852255/
COPY 14444733/ ./14444733/
COPY 18002106/ ./18002106/
COPY 18009154/ ./18009154/
COPY 18110561/ ./18110561/
COPY 18443368/ ./18443368/
COPY 18487832/ ./18487832/
COPY 18819509/ ./18819509/
COPY 18829705/ ./18829705/
COPY 18836874/ ./18836874/
COPY 18938455/ ./18938455/
COPY 19267152/ ./19267152/
COPY 19334139/ ./19334139/
COPY 19371273/ ./19371273/
COPY 19379860/ ./19379860/
COPY 19499302/ ./19499302/
COPY 19558625/ ./19558625/
COPY 19932730/ ./19932730/
COPY 20117857/ ./20117857/
COPY 29551025/ ./29551025/

# Puerto expuesto
EXPOSE 8080

# Comando para ejecutar el servidor
CMD ["python", "./app.py"]

# Instrucciones de ejecución del Dockerfile:
    # 1. Desde la raíz del proyecto, utilizar los siguientes comandos:
        # a. docker build -t contenedorestudiante29551025 .
        # b. docker run -d -p 8080:8080 --name contenedor-perfil contenedorEstudiante29551025
    # 2. Ir al navegador web y dirigirse a: http://localhost:8080/index?lan=ES