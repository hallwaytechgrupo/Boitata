
- Depois de criar o database bd_boitata, insira os shapefiles.

- Vá na pasta shapefiles
  - Na pasta Biomas, rode no terminal:
    - `shp2pgsql -I -s 4326 -W "UTF8" biomas.shp public.bioma | PGPASSWORD=postgres psql -h localhost -d bd_boitata -U postgres`
  - Na pasta Estados, rode no terminal:
    - `shp2pgsql -I -s 4326 -W "UTF8" BR_UF_2023.shp public.estado | PGPASSWORD=postgres psql -h localhost -d bd_boitata -U postgres`
  - Na pasta Municipios, rode no terminal:
    - `shp2pgsql -I -s 4326 -W "UTF8" BR_Municipios_2023.shp public.municipio | PGPASSWORD=postgres psql -h localhost -d bd_boitata -U postgres`

- Agora, pode rodar o restante dos comandos