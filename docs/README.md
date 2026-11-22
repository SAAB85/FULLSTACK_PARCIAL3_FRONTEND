# Documentación — EP3 · Ferretería Los Maestros

**DSY1104 — Desarrollo Full Stack II** · Sección **005V** · Docente **Fernando Díaz Gutiérrez**
**Integrantes:** Sebastián Antipán · Benjamín Sandoval
**Evaluación Parcial 3 — Integración y Comunicación REST** · Versión **3.0** · **22/11/2026**

Esta carpeta reúne la documentación completa del proyecto, en PDF para lectura y en su formato editable para revisión o corrección.

## Documentos

| Documento | PDF | Fuente editable | Contenido |
| --- | --- | --- | --- |
| **ERS** | [ERS-EP3.pdf](ERS-EP3.pdf) | [ERS-EP3.docx](ERS-EP3.docx) | 22 páginas, 30 requisitos funcionales, 17 no funcionales, diagramas, diccionario y trazabilidad. |
| **Anexo 2 — Integración** | [Anexo-2-Integracion.pdf](Anexo-2-Integracion.pdf) | [Anexo-2-Integracion.docx](Anexo-2-Integracion.docx) | 19 páginas y 23 figuras sobre la integración frontend ↔ backend y la matriz de verificación. |
| **Anexo 3 — APIs** | [Anexo-3-APIs.pdf](Anexo-3-APIs.pdf) | [Anexo-3-APIs.xlsx](Anexo-3-APIs.xlsx) | Contrato de los 17 endpoints de `/api/v1`, roles y respuestas. |
| **Anexo 4 — Manual de Usuario** | [Anexo-4-Manual-Usuario.pdf](Anexo-4-Manual-Usuario.pdf) | [Anexo-4-Manual-Usuario.docx](Anexo-4-Manual-Usuario.docx) | 26 páginas y 28 figuras: requisitos, instalación, configuración, uso por rol y solución de problemas. |
| **Presentación EP3** | [Presentacion-EP3.pdf](Presentacion-EP3.pdf) | [Presentacion-EP3.pptx](Presentacion-EP3.pptx) | 16 diapositivas (14 principales + 2 de respaldo), notas del expositor y guion para 15 minutos. |

## Diagramas

- [Modelo entidad-relación](diagramas/modelo-er.png)
- [Arquitectura de componentes](diagramas/componentes.png)
- [Casos de uso](diagramas/casos-uso.png)

## Repositorios

- **Backend:** https://github.com/SAAB85/FULLSTACK_PARCIAL3_BACKEND
- **Frontend:** https://github.com/SAAB85/FULLSTACK_PARCIAL3_FRONTEND

## Puesta en marcha rápida

```bash
# Backend — puerto 8080
cd FULLSTACK_PARCIAL3_BACKEND
./mvnw spring-boot:run

# Frontend — puerto 5173
cd FULLSTACK_PARCIAL3_FRONTEND
cp .env.example .env
npm install
npm run dev
```

- Aplicación: http://localhost:5173
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Consola H2: http://localhost:8080/h2-console (`jdbc:h2:file:./data/ep3db`, usuario `sa`, sin contraseña)
- Usuarios demo: `admin/admin123`, `vendedor/vendedor123`, `cliente/cliente123`
