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
      // ---------------------- OFICIOS GENERALES ----------------------
      { grupo: 'Oficios frecuentes', nombre: 'Recibos genérico', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados "", en trámite ante el .\nAtento a ello, se adjuntan en orden que antecede los recibos de haberes requeridos.\nSe remite a sus fines.', color: 'blue' },
      { grupo: 'Oficios frecuentes', nombre: 'Suma NR2020', texto: 'DIRECCIÓN GENERAL TÉCNICA, ADMINISTRATIVA Y LEGAL\nSe tomó conocimiento del presente Oficio Judicial, en el marco de autos caratulados “” en trámite ante el . \nAtento a ello, se informa que la RESFC N° 162-GCABA-MHFGC/2020 es clara en cuanto dispuso: “Otórgase una suma fija no remunerativa, no bonificable y no acumulativa, que se abonará con los haberes de los meses de febrero y marzo 2020, equivalente al 7,9% sobre el sueldo básico de diciembre 2019, y todo aquel suplemento que lo tome como base para su cálculo…”. \nEn ese sentido, abarcó al personal con estado policial de la Policía de la Ciudad; al personal sin estado policial de la Policía de la Ciudad, que no se encontrara con suspensión preventiva conforme los términos del Decreto N° 53/17; al personal del Cuerpo de Bomberos de la Policía de la Ciudad; y al personal del Instituto Superior de Seguridad Pública que revista en el Escalafón General aprobado por el artículo 2° de la Resolución N° 6/ISSP/2017. \nSeguidamente, dicha Resolución se prorrogó conforme lo dispusieron las Resoluciones de firmas Conjuntas Nros. 313-GCABA-MHFGC/2020, 628-GCABA-MHFGC y 785-GCABA-MHFGC/2020 otorgando la suma fija no remunerativa, no bonificable y no acumulativa, que se abonó con los haberes de los meses de “abril, mayo y junio 2020”; “julio y agosto 2020” y “septiembre y octubre 2020”, respectivamente. \nPosteriormente, por la RESFC N° 08-GCABA-MHFGC/2021 se otorgó al personal de esta Institución, un incremento no remunerativo y no bonificable del 15% sobre el sueldo básico de enero 2020, el cual fue abonado un 5% conjuntamente con los haberes noviembre 2020, 5% conjuntamente con los haberes diciembre 2020 y 5% conjuntamente con los haberes enero 2021. Incorporando además por esta última normativa, al haber mensual, como suplemento “no remunerativo y no bonificable” a la asignación extraordinaria otorgada oportunamente por Resolución de Firma Conjunta N° 162/MHFGC/2020 y sus modificatorias. \nFinalmente –en lo que atañe a este punto–, por la RESFC N° 664-GCABA-MHFGC/2023 se resolvió incorporar, a partir del 1° de julio de 2023, al sueldo básico de la Policía de la Ciudad y del Cuerpo de Bomberos de la Ciudad, el suplemento creado por Resolución de Firma Conjunta N° 8-GCABA-MHFGC/21 y todo aquel suplemento que lo tome como base para su cálculo, razón por la cual, conforme surge de la compulsa en los registros obrantes en esta Dirección General, tal diligencia arroja que el personal en actividad ya no percibe el suplemento de marras en la actualidad. \nSe remite a sus efectos. ', color: 'blue' },
      { grupo: 'Oficios frecuentes', nombre: 'Embargo', texto: 'Ciudad Autónoma de Buenos Aires,', color: 'blue' },
  
      // ---------------------- REQUERIMIENTOS ----------------------
      { grupo: 'Encabezados', nombre: 'Destinatarios', texto: 'Se solicita con carácter urgente el cumplimiento de lo dispuesto...', color: 'green' },
      { grupo: 'Encabezados', nombre: 'Encabezado Oficio', texto: 'Se requiere la remisión de los antecedentes correspondientes al expediente mencionado.', color: 'green' },
      { grupo: 'Encabezados', nombre: 'Encabezado Nota', texto: 'Se requiere la remisión de los antecedentes correspondientes al expediente mencionado.', color: 'green' },
  
      // ---------------------- CIERRES / RESPUESTAS ----------------------
      { grupo: 'Contenido específico', nombre: 'Suma NR2020', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad PC', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad FO PFA', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Antiguedad FO Metro', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Título Univ. Sí', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Título Univ. No', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'T. Min. Sí', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'T. Min. No', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Metodologías', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Sumas NR y NB', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Cuenta Bancaria', texto: 'Quedo a disposición para cualquier aclaración que estime necesaria.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Dict. Procuración', texto: 'Sin otro particular, saludo a Ud. atentamente.', color: 'gray' },
      { grupo: 'Contenido específico', nombre: 'Personal transferido', texto: 'el personal fue transferido en virtud del "Convenio de Transferencia Progresiva a la Ciudad Autónoma de Buenos Aires de Facultades y Funciones de Seguridad en Todas las Materias no Federales Ejercidas en la Ciudad Autónoma de Buenos Aires", suscripto el 05/01/2016 entre el entonces Presidente de la Nación y el Jefe de Gobierno de la C.A.B.A., posteriormente aprobado por la Resolución N° 298-LCBA/2016 de la Legislatura de la Ciudad Autónoma de Buenos Aires (BOCBA N° 4.807), pasando a formar parte de esta Policía de la Ciudad a partir del 01/01/2017.', color: 'gray' },
  
      // ---------------------- LEGALES / NORMATIVOS ----------------------
      { grupo: 'Adjuntos y remisión', nombre: 'Remisión', texto: 'En cumplimiento del art. 4 de la Ley 5688...', color: 'red' },
      { grupo: 'Adjuntos y remisión', nombre: 'Adjunto recibos', texto: 'En relación al expediente SUMA NR 2020/XXXX/GCABA...', color: 'red' },
      { grupo: 'Adjuntos y remisión', nombre: 'Adjunto legajos', texto: 'la/s copia/s de los legajo/s personales solicitado/s, dejando constancia que la documentación obrante en dicho legajo puede contener información médica sensible, datos personales y vinculados al grupo familiar, y a fin de asegurar la protección integral de los mismos, garantizando el derecho a la intimidad y secreto médico, se harán responsables de la confidencialidad de la documentación -conforme fuera solicitado mediante PV-2025-37118786-GCABA-DGAJDEP, en el marco de las actuaciones EX-2025-35812884-GCABA-PG.', color: 'red' },
  
      // ---------------------- ADMINISTRATIVOS / RRHH ----------------------
      { grupo: 'Reclamos y otros', nombre: 'Sto. dictamen', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Reclamos y otros', nombre: 'Sto. rechazo', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Reclamos y otros', nombre: 'Sto. prematuro', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Reclamos y otros', nombre: 'Sto. disposición 126', texto: '[CARÁCTER]: [Director/a de RRHH, Policía de la Ciudad]', color: 'navy' },
      { grupo: 'Reclamos y otros', nombre: 'Sto. disposición 196', texto: 'Autorizo la licencia solicitada en los términos del Artículo 63 del Reglamento de Licencias.', color: 'navy' },
  
      // ---------------------- ADMINISTRATIVOS / RRHH ----------------------
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
  