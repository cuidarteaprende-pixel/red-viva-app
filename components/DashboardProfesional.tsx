"use client";

import React from 'react';

const DashboardProfesional: React.FC = () => {
    return (
        <div className="bg-[#f5f8f8] dark:bg-[#101e22] text-[#0d181c] dark:text-white transition-colors duration-200 min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#f5f8f8]/80 dark:bg-[#101e22]/80 backdrop-blur-md border-b border-[#cee2e8] dark:border-white/10">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto">
                    <div className="flex size-10 shrink-0 items-center">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#0db9f2]"
                            aria-label="Professional profile picture of a female caregiver"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7Qco-8RbWvFrod80O1wA4vt7gagP1g4GyYhPa97zO0fssfBY4uIeCfhJUFkyNthpQec9IV2PstSe5mDPPEdasOFV5KSojWRYB7WP-Nm1jabAM1W_9qGX02KTfONVzX2u5aJZwA4ZQkkdaWjOz9aTeVBAJ3wkcxr7C39MbKg36fxEJH1vE9KYRhxqmIUl8eqtbSuiXOj8tSJRyXaC9PwQ5DMxr83PFyRMaxIt2rAGLelOE4XAJ2eFy5agcqTiTASHdsOKm4AKF")' }}
                        >
                        </div>
                    </div>
                    <div className="flex-1 px-3">
                        <h1 className="text-[#0d181c] dark:text-white text-lg font-bold leading-tight tracking-tight">Dashboard Profesional</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[#0d181c] dark:text-white">notifications</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto pb-24">
                {/* Greeting Section */}
                <section className="px-4 pt-6 pb-2">
                    <h2 className="text-[#0d181c] dark:text-white text-2xl font-bold">Hola, Elena 👋</h2>
                    <p className="text-[#49879c] dark:text-[#9bbcc9] text-base font-normal mt-1">Aquí tienes el resumen para hoy.</p>
                </section>

                {/* Stats Grid */}
                <section className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex flex-col gap-2 rounded-xl p-5 border border-[#cee2e8] dark:border-white/10 bg-white dark:bg-[#1a2b30] shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-medium uppercase tracking-wider">Reportes hoy</p>
                                <p className="text-[#0d181c] dark:text-white tracking-tighter text-4xl font-bold mt-1">12</p>
                            </div>
                            <div className="bg-[#0db9f2]/10 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-[#0db9f2]">analytics</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <span className="material-symbols-outlined text-[#078836] text-sm">trending_up</span>
                            <p className="text-[#078836] text-sm font-semibold">+15% vs ayer</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl p-5 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                        <div className="flex justify-between items-start">
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium">Alertas</p>
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                        </div>
                        <p className="text-red-900 dark:text-red-100 text-2xl font-bold">2</p>
                        <p className="text-red-600/80 dark:text-red-400/80 text-xs font-bold uppercase">Críticas</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#cee2e8] dark:border-white/10 bg-white dark:bg-[#1a2b30]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-medium">Activos</p>
                            <span className="material-symbols-outlined text-[#0db9f2]">groups</span>
                        </div>
                        <p className="text-[#0d181c] dark:text-white text-2xl font-bold">8</p>
                        <p className="text-[#078836] text-xs font-bold uppercase">Estable</p>
                    </div>
                </section>

                {/* Quick Actions Header */}
                <section className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <h2 className="text-[#0d181c] dark:text-white text-xl font-bold leading-tight tracking-tight">Últimos reportes</h2>
                    <button className="text-[#0db9f2] text-sm font-semibold">Ver todos</button>
                </section>

                {/* List Section */}
                <section className="flex flex-col">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 px-4 py-4 hover:bg-white dark:hover:bg-white/5 transition-colors border-b border-[#cee2e8]/50 dark:border-white/5">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border border-gray-100"
                                aria-label="Elderly woman with gray hair smiling"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgaVu6OaUpzF4mqdjYSAKd6pPvnF0WPm0ugSUGsQLghedbmc-bXvnvCaSkN8SpL8T9adrRbdWkIOtQwmVa1CZmbd0qARvXTNBU84wpoVID2waM2nux0HmSu2WKKXYZW0cYCgbRHIQFWRpMgBSXGmdxyIeZlH8PrVuM6e7fWa66hxB9mxkCeZA7-HWcFIuOeAeqkq4smG1sDZt3H0z7aYJsp4HZtVXZII4SDQVXFjTEypQmliku91UCCP-7hty3u7lf3VkAk4vi")' }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-4 bg-[#078836] rounded-full border-2 border-[#f5f8f8] dark:border-[#101e22]"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-[#0d181c] dark:text-white text-base font-bold leading-tight">Carmen González</p>
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-normal mt-0.5">Medicamento administrado</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-xs font-medium">5 min</p>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">chevron_right</span>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-4 px-4 py-4 hover:bg-white dark:hover:bg-white/5 transition-colors border-b border-[#cee2e8]/50 dark:border-white/5">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border border-gray-100"
                                aria-label="Elderly man with glasses wearing a blue sweater"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVIIz_s1_rzTRB1t9atiX9eXDNzhCjyVVy_1wyqIP6OKuilWcZlIejsgWffI4-g_a8Np2sbhlftFO8glZUGZqrP1QEfUgbyia7N4aJHWutXnZLBW8Y3tlhgtdKVlVzaQMaWCrv3h6b8Cnfb-3zqKJ1j0OTPuIX4CIOIpAk4YDfLFwVrFTteb812LVpSgzRTialAwn_UQBZFAUieqOnkQOuoubJT3sO43OUqj4YUYwgtXZLT60ag9HIQeW_qscZqGqkLUeSCh5e")' }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-4 bg-orange-500 rounded-full border-2 border-[#f5f8f8] dark:border-[#101e22]"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-[#0d181c] dark:text-white text-base font-bold leading-tight">Roberto Mendez</p>
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-normal mt-0.5">Control de presión arterial</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-xs font-medium">18 min</p>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">chevron_right</span>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-4 px-4 py-4 hover:bg-white dark:hover:bg-white/5 transition-colors border-b border-[#cee2e8]/50 dark:border-white/5">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border border-gray-100"
                                aria-label="Elderly woman with white hair and glasses"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB36R-wu0jT9O4WSoxNmm91l-5TaSASzTSMVTcTbZCgtO_nKDD6x_zF1Eb4Ps0cUpcwZgk_gT8YvLJFXC8eGpIkNoxKk6uRlhaV6E4qeHEoCWcGN3wKRM21NZIVHNcEDLU_afKh6DfXGjXTDJ8gC6X7N4rOX9CSdeudD0U9IAsgD5_vuoSFcaxlKMXLGr2UOhUMwGtpdG5NMyuSnESkSTxFA3EqLylRzqATSQXsA6TDcuZfuERLfRvgm7UIzo7BcTSZF-4Dj6Ic")' }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-4 bg-[#078836] rounded-full border-2 border-[#f5f8f8] dark:border-[#101e22]"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-[#0d181c] dark:text-white text-base font-bold leading-tight">Elena Ruiz</p>
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-normal mt-0.5">Sesión de fisioterapia completada</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-xs font-medium">1 h</p>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">chevron_right</span>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-4 px-4 py-4 hover:bg-white dark:hover:bg-white/5 transition-colors">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border border-gray-100"
                                aria-label="Elderly man with beard and a hat"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuHIG20bdTLPjxLBjpY_z9XLiXLSjYHUuD4UqWu-Cpa06QG0YrNdpWcyudItWI8Z2hkfYuFMayCLHZMqeP28QitBAoYYeyYzi1qs7BrfQ7YgG1MpyEbnoaeyC4TomTOSU7Zx8BuvtdPSt5b-_bGz4uOLzAr4P9R7GL4DYHZREGdfOqcEQJziu-AtzPPjsqRDSauA5Z3yYy93qnzYzp1SEFKq0jJ0AMUHE1jFVRGsdcEprAvTPcbmSfzUwh3r0RAtCnXeB7zezT")' }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-4 bg-[#078836] rounded-full border-2 border-[#f5f8f8] dark:border-[#101e22]"></div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-[#0d181c] dark:text-white text-base font-bold leading-tight">Joaquín Soto</p>
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-sm font-normal mt-0.5">Ingesta de líquidos registrada</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[#49879c] dark:text-[#9bbcc9] text-xs font-medium">2 h</p>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">chevron_right</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <button className="fixed right-6 bottom-24 bg-[#0db9f2] text-white size-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#101e22]/90 backdrop-blur-lg border-t border-[#cee2e8] dark:border-white/10 px-6 py-2 pb-8 z-50">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <button className="flex flex-col items-center gap-1 text-[#0db9f2]">
                        <span className="material-symbols-outlined font-bold">home</span>
                        <span className="text-[10px] font-bold">Inicio</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">person_search</span>
                        <span className="text-[10px] font-medium">Pacientes</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">edit_document</span>
                        <span className="text-[10px] font-medium">Reportes</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[10px] font-medium">Ajustes</span>
                    </button>
                </div>
            </nav>

            {/* External dependencies (Icons) */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </div>
    );
};

export default DashboardProfesional;
