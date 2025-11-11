// ==UserScript==
// @name         Word Online – Panel de Modelos DGARHC (v1.15 con enlaces externos)
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Panel lateral auto-desplegable con pestaña de 2px, subtítulos por grupo y enlaces externos al final. Copia modelos o abre links en Word Online. Título: Modelos DGARHC.
// @author       Sac
// @match        https://onedrive.live.com/*
// @match        https://office.live.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // 🧱 Lista central de modelos, con grupo (sección) y color
    const SNIPPETS = [
      // ---------------------- OFICIOS FRECUENTES ----------------------
      { grupo: 'Oficios frecuentes', nombre: 'Recibos genérico', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados "", en trámite ante el .\nAtento a ello, se adjuntan en orden que antecede los recibos de haberes requeridos.\nSe remite a sus fines.', color: 'blue' },
      { grupo: 'Oficios frecuentes', nombre: 'Suma NR2020', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, se informa que la RESFC N° 162-GCABA-MHFGC/2020 es clara en cuanto dispuso: “Otórgase una suma fija no remunerativa, no bonificable y no acumulativa, que se abonará con los haberes de los meses de febrero y marzo 2020, equivalente al 7,9% sobre el sueldo básico de diciembre 2019, y todo aquel suplemento que lo tome como base para su cálculo…”. \nEn ese sentido, abarcó al personal con estado policial de la Policía de la Ciudad; al personal sin estado policial de la Policía de la Ciudad, que no se encontrara con suspensión preventiva conforme los términos del Decreto N° 53/17; al personal del Cuerpo de Bomberos de la Policía de la Ciudad; y al personal del Instituto Superior de Seguridad Pública que revista en el Escalafón General aprobado por el artículo 2° de la Resolución N° 6/ISSP/2017. \nSeguidamente, dicha Resolución se prorrogó conforme lo dispusieron las Resoluciones de firmas Conjuntas Nros. 313-GCABA-MHFGC/2020, 628-GCABA-MHFGC y 785-GCABA-MHFGC/2020 otorgando la suma fija no remunerativa, no bonificable y no acumulativa, que se abonó con los haberes de los meses de “abril, mayo y junio 2020”; “julio y agosto 2020” y “septiembre y octubre 2020”, respectivamente. \nPosteriormente, por la RESFC N° 08-GCABA-MHFGC/2021 se otorgó al personal de esta Institución, un incremento no remunerativo y no bonificable del 15% sobre el sueldo básico de enero 2020, el cual fue abonado un 5% conjuntamente con los haberes noviembre 2020, 5% conjuntamente con los haberes diciembre 2020 y 5% conjuntamente con los haberes enero 2021. Incorporando además por esta última normativa, al haber mensual, como suplemento “no remunerativo y no bonificable” a la asignación extraordinaria otorgada oportunamente por Resolución de Firma Conjunta N° 162/MHFGC/2020 y sus modificatorias. \nFinalmente –en lo que atañe a este punto–, por la RESFC N° 664-GCABA-MHFGC/2023 se resolvió incorporar, a partir del 1° de julio de 2023, al sueldo básico de la Policía de la Ciudad y del Cuerpo de Bomberos de la Ciudad, el suplemento creado por Resolución de Firma Conjunta N° 8-GCABA-MHFGC/21 y todo aquel suplemento que lo tome como base para su cálculo, razón por la cual, conforme surge de la compulsa en los registros obrantes en esta Dirección General, tal diligencia arroja que el personal en actividad ya no percibe el suplemento de marras en la actualidad. \nSe remite a sus efectos. ', color: 'blue' },
      { grupo: 'Oficios frecuentes', nombre: 'Embargo finalizado', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, habiéndose realizado la compulsa en los registros obrantes en esta Dirección General, tal diligencia arroja que el embargo de marras fue retenido en su totalidad, finalizando en el mes de, adjuntándose comprobante de depósito correspondiente. \nSe remite a sus efectos.', color: 'blue' },
      { grupo: 'Oficios frecuentes', nombre: 'Datos bancarios', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL \nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, se informan los datos bancarios requeridos: \nBANCO: \nTITULAR: \nNÚMERO DE CUENTA: \nTIPO: \nCBU: \nSe remite a sus fines. ', color: 'blue' },

      // ---------------------- ENCABEZADOS ----------------------
      { grupo: 'Encabezados', nombre: 'Destinatarios', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nOFICINA DE TRANSPARENCIA Y CONTROL EXTERNO DE LA POLICIA DE LA CIUDAD \nDIRECCIÓN APOYO ADMINISTRATIVO Y ASISTENCIA POLICIAL ', color: 'green' },
      { grupo: 'Encabezados', nombre: 'Encabezado Oficio', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, ', color: 'green' },
      { grupo: 'Encabezados', nombre: 'Encabezado Nota', texto: 'Tengo el agrado de dirigirme a Ud. En respuesta a Nota N° en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, ', color: 'green' },

      // ---------------------- CONTENIDO ESPECÍFICO ----------------------
      { grupo: 'Contenido específico', nombre: 'Suma NR2020', texto: 'la RESFC N° 162-GCABA-MHFGC/2020 es clara en cuanto dispuso: “Otórgase una suma fija no remunerativa, no bonificable y no acumulativa, que se abonará con los haberes de los meses de febrero y marzo 2020, equivalente al 7,9% sobre el sueldo básico de diciembre 2019, y todo aquel suplemento que lo tome como base para su cálculo…”. \nEn ese sentido, abarcó al personal con estado policial de la Policía de la Ciudad; al personal sin estado policial de la Policía de la Ciudad, que no se encontrara con suspensión preventiva conforme los términos del Decreto N° 53/17; al personal del Cuerpo de Bomberos de la Policía de la Ciudad; y al personal del Instituto Superior de Seguridad Pública que revista en el Escalafón General aprobado por el artículo 2° de la Resolución N° 6/ISSP/2017. \nSeguidamente, dicha Resolución se prorrogó conforme lo dispusieron las Resoluciones de firmas Conjuntas Nros. 313-GCABA-MHFGC/2020, 628-GCABA-MHFGC y 785-GCABA-MHFGC/2020 otorgando la suma fija no remunerativa, no bonificable y no acumulativa, que se abonó con los haberes de los meses de “abril, mayo y junio 2020”; “julio y agosto 2020” y “septiembre y octubre 2020”, respectivamente. \nPosteriormente, por la RESFC N° 08-GCABA-MHFGC/2021 se otorgó al personal de esta Institución, un incremento no remunerativo y no bonificable del 15% sobre el sueldo básico de enero 2020, el cual fue abonado un 5% conjuntamente con los haberes noviembre 2020, 5% conjuntamente con los haberes diciembre 2020 y 5% conjuntamente con los haberes enero 2021. Incorporando además por esta última normativa, al haber mensual, como suplemento “no remunerativo y no bonificable” a la asignación extraordinaria otorgada oportunamente por Resolución de Firma Conjunta N° 162/MHFGC/2020 y sus modificatorias. \nFinalmente –en lo que atañe a este punto–, por la RESFC N° 664-GCABA-MHFGC/2023 se resolvió incorporar, a partir del 1° de julio de 2023, al sueldo básico de la Policía de la Ciudad y del Cuerpo de Bomberos de la Ciudad, el suplemento creado por Resolución de Firma Conjunta N° 8-GCABA-MHFGC/21 y todo aquel suplemento que lo tome como base para su cálculo, razón por la cual, conforme surge de la compulsa en los registros obrantes en esta Dirección General, tal diligencia arroja que el personal en actividad ya no percibe el suplemento de marras en la actualidad.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad PC', texto: 'el “Suplemento antigüedad de servicio”, de carácter remunerativo y bonificable, se determina conforme el procedimiento establecido en el Artículo 9° del Decreto 47/17, percibiéndolo la totalidad del personal por sus años de servicio en Policía de la Ciudad. ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad FO PFA', texto: 'a la antigüedad, se debe determinar en primer lugar, la remuneración que el personal percibe por sus años en la Policía de la Ciudad, y en segundo lugar las percepciones que le pudieran corresponder por sus años de antigüedad en fuerza de origen, en razón de haber sido traspasado en el marco del convenio de transferencia. \nEn relación al primero, el “Suplemento antigüedad de servicio”, de carácter remunerativo y bonificable, se determina conforme el procedimiento establecido en el Artículo 9° del Decreto 47/17, percibiéndolo la totalidad del personal por sus años de servicio en Policía de la Ciudad. \nEn segundo lugar, debe determinarse si al personal le corresponde la percepción del “Suplemento Residual por Antigüedad en Fuerza de Origen”, el cual se determina -para el caso del personal que integraba la Policía Federal Argentina- a tenor del inciso a) del Artículo 33 del Decreto 47/17: \nEl monto que el personal hubiera percibido en concepto de antigüedad el 1 de enero de 2017 (artículo 389 del inciso a) Decreto N° 1.866/PEN/83) se incorpora al “SALARIO CONFORMADO EN POLICÍA DE LA CIUDAD" por la diferencia con el "SALARIO CONFORMADO FINAL", en caso que éste resulte inferior. \nEn ese sentido, se utiliza el monto que el personal ex integrante de la Policía Federal Argentina hubiera percibido el 1 de enero de 2017, incorporándose a la diferencia nombrada en el párrafo anterior, en caso que el “SALARIO CONFORMADO FINAL” resulte inferior al “SALARIO CONFORMADO EN POLICÍA DE LA CIUDAD”. \nEn caso contrario, si el “SALARIO CONFORMADO FINAL” resulta superior al “SALARIO CONFORMADO EN POLICÍA DE LA CIUDAD”, o bien, si de la incorporación al “SALARIO CONFORMADO EN POLICÍA DE LA CIUDAD” se refleja un monto excedente, el saldo resultante de este cálculo integrará el “Suplemento Residual por Antigüedad en Fuerza de Origen”, de carácter remunerativo y bonificable, reflejándose bajo el rótulo “Sup. Res. Antigüedad F.O.” en el recibo de haberes. ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad FO Metro', texto: 'Para el caso del personal integrante de la ex Policía Metropolitana, acorde al procedimiento establecido en el artículo 35 inciso a) del Decreto 47/17, lo que hubieran percibido en concepto de antigüedad el 1 de enero de 2017 conforma en adelante el concepto “Suplemento Residual por Antigüedad en Fuerza de Origen” siendo remunerativo, bonificable y ajustable por los porcentajes de ajuste que se apliquen al sueldo básico.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Título Univ. Sí', texto: 'el plexo normativo de marras no contempla ninguna remuneración bajo el rótulo “Suplemento por título” ni prevé asignaciones para el personal de la Policía de la Ciudad que acredite título universitario de grado o terciario. \nSin perjuicio de ello, el “Suplemento por título” a tenor del Artículo 76 de la Ley N° 21.965, respecto del personal cuya fuerza de origen fue la Policía Federal Argentina y resultó transferido en virtud del “Convenio de Transferencia Progresiva a la Ciudad Autónoma de Buenos Aires de Facultades y Funciones de Seguridad en Todas las Materias no Federales Ejercidas en la Ciudad Autónoma de Buenos Aires”, se encuentra contemplado dentro del “SALARIO CONFORMADO EN FUERZA DE ORIGEN”, a tenor del procedimiento obrante en el Artículo 31 del Decreto 47/17. ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Título Univ. No', texto: 'a la remuneración por título universitario en su fuerza de origen, el personal no registra percepciones de dicha naturaleza abonadas en la Policía Federal Argentina. ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Tiempo Min. Grado', texto: 'al suplemento por tiempo mínimo en el grado en fuerza de origen, se determina en virtud de los términos obrantes en los artículos 36 y 37 del Decreto 47/17. ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Metodologías', texto: 'sobre la metodología empleada para la determinación del monto del sueldo del personal traspasado de la Policía Federal y del personal de la Policía Metropolitana, se comunica que el procedimiento consiste en lo estipulado en el título “Reglamentación Cláusulas Transitorias Sexta, Séptima, Octava, Novena y Décimo Cuarta de la Ley N° 5.688” -Arts. 30 a 45- del Decreto 47/17.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Sumas NR y NB', texto: 'perciben asignaciones no remunerativas y no bonificables conforme la normativa vigente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Dict. Procuración', texto: 'Cabe señalar que la Procuración de la Ciudad de Buenos Aires ha emitido distintos dictámenes, en los que ha considerado que: “La Administración tiene la obligación de aplicar las leyes tal cual han sido dictadas, careciendo de facultades para dirimir o decidir sobre su constitucionalidad, no resultándole factible apartarse de la legislación vigente” (Dictamen N° IF-2014-8314507-PGAAPYF, 7 de julio de 2014 - Referencia: EX N° 434749/2013) “No corresponde expedirse en la instancia administrativa sobre la validez de las normas que el recurrente estima afectan sus derechos y garantías constitucionalmente protegidos” (Dictamen N° IF-2013- 02418970-DGEMPP, 13 de junio de 2013- Referencia: RE N° 7136965-PG-2012), entre otros.  ', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Personal transferido', texto: 'el personal fue transferido en virtud del "Convenio de Transferencia Progresiva a la Ciudad Autónoma de Buenos Aires de Facultades y Funciones de Seguridad en Todas las Materias no Federales Ejercidas en la Ciudad Autónoma de Buenos Aires", suscripto el 05/01/2016 entre el entonces Presidente de la Nación y el Jefe de Gobierno de la C.A.B.A., posteriormente aprobado por la Resolución N° 298-LCBA/2016 de la Legislatura de la Ciudad Autónoma de Buenos Aires (BOCBA N° 4.807), pasando a formar parte de esta Policía de la Ciudad a partir del 01/01/2017.', color: 'gray' },

      // ---------------------- ADJUNTOS Y REMISIÓN ----------------------
      { grupo: 'Adjuntos y remisión', nombre: 'Remisión', texto: 'Se remite a sus fines.', color: 'red' },
      { grupo: 'Adjuntos y remisión', nombre: 'Adjunto recibos', texto: 'se adjuntan los recibos de haberes requeridos', color: 'red' },
      { grupo: 'Adjuntos y remisión', nombre: 'Adjunto legajos', texto: 'la/s copia/s de los legajo/s personales solicitado/s, dejando constancia que la documentación obrante en dicho legajo puede contener información médica sensible, datos personales y vinculados al grupo familiar, y a fin de asegurar la protección integral de los mismos, garantizando el derecho a la intimidad y secreto médico, se harán responsables de la confidencialidad de la documentación -conforme fuera solicitado mediante PV-2025-37118786-GCABA-DGAJDEP, en el marco de las actuaciones EX-2025-35812884-GCABA-PG.', color: 'red' },

      // ---------------------- SENTENCIA SUMA NR ----------------------
      { grupo: 'Sentencia Suma NR', nombre: 'Scia. disposición', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sentencia Suma NR', nombre: 'Scia. providencia', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sentencia Suma NR', nombre: 'Scia. nota DGAJDEP', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sentencia Suma NR', nombre: 'Scia. correo', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },

        // ---------------------- SOBRESEIMIENTO ----------------------
      { grupo: 'Sobreseimiento', nombre: 'Sto. dictamen', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sobreseimiento', nombre: 'Sto. rechazo', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sobreseimiento', nombre: 'Sto. prematuro', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sobreseimiento', nombre: 'Sto. disposición 126', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Sobreseimiento', nombre: 'Sto. disposición 196', texto: 'Autorizo la licencia solicitada en los términos del Artículo 63 del Reglamento de Licencias.', color: 'navy' },
      { grupo: 'Sobreseimiento', nombre: 'Sto. correo', texto: 'Autorizo la licencia solicitada en los términos del Artículo 63 del Reglamento de Licencias.', color: 'navy' },

      // ---------------------- RECLAMOS Y OTROS ----------------------
      { grupo: 'Reclamos y otros', nombre: 'Antiguedad', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'purple' },
      { grupo: 'Reclamos y otros', nombre: 'Requerimiento', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'purple' },

      // ---------------------- RECURSOS ----------------------
      { grupo: 'Recursos', nombre: 'Reconsideración', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'purple' },
      { grupo: 'Recursos', nombre: 'Reconsideración 123', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'purple' },
      { grupo: 'Recursos', nombre: 'Jerárquico directo', texto: 'Autorizo la licencia solicitada en los términos del Artículo 63 del Reglamento de Licencias.', color: 'purple' },
      { grupo: 'Recursos', nombre: 'Jerárquico en subsidio', texto: 'Autorizo la licencia solicitada en los términos del Artículo 63 del Reglamento de Licencias.', color: 'purple' },

      // ---------------------- ENLACES ÚTILES ----------------------
      { grupo: 'Normativa', nombre: 'Ley 5.688', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'orange' },
      { grupo: 'Normativa', nombre: 'Decreto 47/17', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'orange' },
      { grupo: 'Normativa', nombre: 'Decreto 53/17', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'orange' },
      { grupo: 'Normativa', nombre: 'LPA CABA', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'orange' },
      { grupo: 'Normativa', nombre: 'Carpeta Drive DGARHC', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'orange' },
      { grupo: 'Normativa', nombre: 'Planilla de control interno', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'orange' },

      // ---------------------- ENLACES ÚTILES ----------------------
      { grupo: 'Enlaces útiles', nombre: 'Panel Oficios', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'Trello', url: 'https://trello.com/b/2fjTHQPB/sector-expedientes', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'Descarga Recibos', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'Planilla Scias. y Stos.', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'Simuladores', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'Sueldos básicos', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'SIRHU', url: 'https://drive.google.com/drive/folders/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'SADE', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'gray' },
      { grupo: 'Enlaces útiles', nombre: 'SILOL', url: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX', color: 'gray' },
    ];

    // Esperar que cargue el body
    const waitBody = setInterval(() => {
      if (document.body && !document.getElementById('snippetPanel')) {
        clearInterval(waitBody);
        mountPanel();
      }
    }, 800);

    function mountPanel() {
      const panel = document.createElement('div');
      panel.id = 'snippetPanel';

      // Agrupar los modelos por sección
      const grupos = {};
      for (const s of SNIPPETS) {
        if (!grupos[s.grupo]) grupos[s.grupo] = [];
        grupos[s.grupo].push(s);
      }

      // Generar contenido (respetando el orden original del array)
      let html = '<div class="header">Panel DGARHC</div>';
      for (const grupo in grupos) {
        html += `<div class="grupo-titulo">${grupo}</div>`;
        for (const s of grupos[grupo]) {
          const contenido = s.url
            ? `data-url="${s.url}"` // si es link
            : `data-text="${s.texto.replace(/"/g, '&quot;')}"`;
          html += `<button ${contenido} data-color="${s.color || 'blue'}">${s.nombre}</button>`;
        }
      }
      panel.innerHTML = html;
      document.body.appendChild(panel);

      // 🎨 Estilos
      const style = document.createElement('style');
      style.textContent = `
        #snippetPanel {
          position: fixed;
          left: -178px; /* width - 2px */
          top: 0;
          bottom: 0;
          width: 180px;
          background: #f4f4f4;
          border-right: 1px solid #bbb;
          box-shadow: 2px 0 5px rgba(0,0,0,0.15);
          z-index: 2147483647;
          padding: 8px;
          font-family: sans-serif;
          overflow-y: auto;
          overflow-x: hidden;
          transition: left 0.25s ease;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          box-sizing: border-box;
        }
        #snippetPanel::before {
          content: "";
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #0078d4;
          border-top-right-radius: 1px;
          border-bottom-right-radius: 1px;
          cursor: pointer;
        }
        #snippetPanel:hover { left: 0; }
        #snippetPanel .header {
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
          font-size: 15px;
          color: #222;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6px;
        }
        .grupo-titulo {
          font-weight: bold;
          font-size: 12px;
          color: #333;
          background: #e0e0e0;
          border-radius: 3px;
          padding: 3px 5px;
          margin: 10px 0 4px 0;
        }
        #snippetPanel button {
          display: block;
          width: calc(100% - 4px);
          margin: 4px auto;
          padding: 6px 5px;
          border: none;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          text-align: left;
          white-space: normal;
          box-sizing: border-box;
          transition: background 0.15s ease;
        }

        /* 🎨 Colores por categoría */
        #snippetPanel button[data-color="blue"]   { background:#0078d4; }
        #snippetPanel button[data-color="green"]  { background:#228B22; }
        #snippetPanel button[data-color="gray"]   { background:#555; }
        #snippetPanel button[data-color="red"]    { background:#B22222; }
        #snippetPanel button[data-color="orange"] { background:#d47f00; }
        #snippetPanel button[data-color="navy"] { background:#000080; }
        #snippetPanel button[data-color="purple"] { background:#A020F0; }

        #snippetPanel button:hover { filter: brightness(0.9); }
      `;
      document.head.appendChild(style);

      // Eventos de acción (copiar o abrir enlace)
      panel.querySelectorAll('button').forEach(btn =>
        btn.addEventListener('click', () => {
          if (btn.dataset.url) {
            window.open(btn.dataset.url, '_blank');
          } else if (btn.dataset.text) {
            copyText(btn.dataset.text);
          }
        })
      );

      console.log('✅ Panel de Modelos DGARHC v1.15 cargado correctamente');
    }

    function copyText(text) {
      if (typeof GM_setClipboard !== 'undefined') {
        GM_setClipboard(text);
        toast('📋 Copiado');
      } else {
        navigator.clipboard.writeText(text).then(() => toast('📋 Copiado'));
      }
    }

    function toast(msg) {
      const t = document.createElement('div');
      t.textContent = msg;
      Object.assign(t.style, {
        position: 'fixed',
        left: '50%',
        bottom: '30px',
        transform: 'translateX(-50%)',
        background: '#0078d4',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'sans-serif',
        zIndex: '2147483647',
        opacity: '0',
        transition: 'opacity .3s'
      });
      document.body.appendChild(t);
      setTimeout(() => (t.style.opacity = '1'), 50);
      setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 300);
      }, 1200);
    }
  })();
