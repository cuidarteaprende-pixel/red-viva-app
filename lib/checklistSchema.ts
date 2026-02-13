export const checklistSchema = {
    spheres: [
        {
            id: "funcional",
            label: "Esfera Funcional",
            icon: "accessibility_new",
            questions: [
                {
                    id: "autocuidado",
                    label: "Autocuidado (AVD)",
                    type: "select",
                    options: [
                        { value: "ok", label: "Independiente" },
                        { value: "regular", label: "Ayuda parcial" },
                        { value: "bajo", label: "Dependiente" },
                    ],
                },
                {
                    id: "riesgo_caidas",
                    label: "Riesgo de Caídas",
                    type: "select",
                    options: [
                        { value: "bajo", label: "Bajo" },
                        { value: "medio", label: "Medio" },
                        { value: "alto", label: "Alto" },
                    ],
                },
            ],
        },
        {
            id: "mental",
            label: "Esfera Mental",
            icon: "psychology",
            questions: [
                {
                    id: "memoria",
                    label: "Memoria",
                    type: "select",
                    options: [
                        { value: "preservada", label: "Preservada" },
                        { value: "olvidos_leves", label: "Olvidos leves" },
                        { value: "desorientacion", label: "Desorientación" },
                    ],
                },
            ],
        },
        {
            id: "emocional",
            label: "Esfera Emocional",
            icon: "mood",
            questions: [
                {
                    id: "animo",
                    label: "Estado de Ánimo",
                    type: "select",
                    options: [
                        { value: "estable", label: "Estable / Positivo" },
                        { value: "ansioso", label: "Ansioso / Agitado" },
                        { value: "deprimido", label: "Triste / Apático" },
                    ],
                },
            ],
        },
        {
            id: "social",
            label: "Esfera Social",
            icon: "groups",
            questions: [
                {
                    id: "red_apoyo",
                    label: "Red de Apoyo Familiar",
                    type: "select",
                    options: [
                        { value: "fuerte", label: "Presente y activa" },
                        { value: "moderada", label: "Intermitente" },
                        { value: "debil", label: "Ausente / Escasa" },
                    ],
                },
            ],
        },
        {
            id: "sensorial",
            label: "Esfera Sensorial",
            icon: "visibility",
            questions: [
                {
                    id: "vision",
                    label: "Visión / Audición",
                    type: "select",
                    options: [
                        { value: "ok", label: "Sin limitaciones" },
                        { value: "limitada", label: "Limitación parcial" },
                        { value: "severa", label: "Limitación severa" },
                    ],
                },
            ],
        },
        {
            id: "polifarmacia",
            label: "Nutrición y Polifarmacia",
            icon: "medication",
            questions: [
                {
                    id: "estado_nutricional",
                    label: "Nutrición / Hidratación",
                    type: "select",
                    options: [
                        { value: "bueno", label: "Ingesta completa" },
                        { value: "regular", label: "Ingesta parcial" },
                        { value: "malo", label: "Rechazo alimentario" },
                    ],
                },
                {
                    id: "toma_completa",
                    label: "¿Tomó todos los medicamentos?",
                    type: "boolean",
                },
            ],
        },
    ],
};
