# Plan de Pruebas "Red Viva" (UX/UI Reborn)

## 1. Gateway y Autenticación
- [ ] **Acceso Visual**: Ir a `/gateway`. Los botones deben tener hover y ser legibles.
- [ ] **Auth Pro**: Ir a `/auth/login?role=pro`. Debe aparecer en azul. Probar login con credenciales inválidas (debe mostrar error en rojo).
- [ ] **Auth Cuidador**: Ir a `/auth/login?role=caregiver`. Debe aparecer en rosa. Probar envío de Magic Link.

## 2. Flujo Cuidador (Mobile-First)
- [ ] **Dashboard**: Verificar que el selector de persona funcione y guarde en `localStorage`.
- [ ] **Wizard 360**:
    - [ ] Probar navegación entre pasos (Atrás/Siguiente).
    - [ ] Verificar que no deje avanzar sin responder.
    - [ ] Al finalizar, verificar la notificación de éxito (sonner) y redirección.
- [ ] **Urgencia**: Enviar reporte crítico y verificar feedback visual inmediato.

## 3. Consola Profesional (Escritorio)
- [ ] **Sidebar**: Probar navegación entre secciones.
- [ ] **Dashboard**: Verificar contadores (Stats) y lista de alertas recientes.
- [ ] **Historia 360**: Entrar al detalle de un paciente y verificar la línea del tiempo.

## 4. Accesibilidad (WCAG AA)
- [ ] **Teclado**: Usar `TAB` en el Wizard 360. Todos los botones deben tener anillo de enfoque.
- [ ] **Lectores**: Verificar que los pasos del Wizard anuncien el cambio (aria-live).
- [ ] **Contrastes**: Los textos en blanco sobre azul/rosa deben ser legibles.
