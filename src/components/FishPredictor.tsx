"use client";

import { useState } from "react";

const FISKE_TYPER = [
    "Torsk",
    "Sei",
    "Laks",
    "Makrell",
    "Kveite",
    "Lyr",
    "Brosme",
    "Breiflabb",
    "Pale",
    "Flyndre",
    "Uer",
];
const MAANEDER = [
    { nr: 1, navn: "Januar" },
    { nr: 2, navn: "Februar" },
    { nr: 3, navn: "Mars" },
    { nr: 4, navn: "April" },
    { nr: 5, navn: "Mai" },
    { nr: 6, navn: "Juni" },
    { nr: 7, navn: "Juli" },
    { nr: 8, navn: "August" },
    { nr: 9, navn: "September" },
    { nr: 10, navn: "Oktober" },
    { nr: 11, navn: "November" },
    { nr: 12, navn: "Desember" },
];

interface PredictionResult {
    sjanse_for_at_den_slipper: string;
    anbefaling: string;
}

export default function FiskeSiden() {
    const [vekt, setVekt] = useState<number>(5.0);
    const [dyp, setDyp] = useState<number>(30);
    const [maaned, setMaaned] = useState<number>(new Date().getMonth() + 1);
    const [omraade, setOmraade] = useState<string>("Austevoll");
    const [sluk, setSluk] = useState<string>("Møresilda");
    const [fiskType, setFiskType] = useState<string>("Torsk");

    const [resultat, setResultat] = useState<PredictionResult | null>(null);
    const [laster, setLaster] = useState<boolean>(false);

    const getRiskColor = (prosentStr: string) => {
        const prosent = parseFloat(prosentStr.replace("%", ""));
        if (prosent < 30) return "text-green-600";
        if (prosent < 70) return "text-yellow-600";
        return "text-red-600";
    };

    const analyserSituasjonen = async () => {
        setLaster(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/predict`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        maaned: maaned,
                        dyp_meter: dyp,
                        vekt_kg: vekt,
                        omraade: omraade,
                        sluk: sluk,
                        fisk_type: fiskType,
                    }),
                },
            );

            if (!response.ok) throw new Error("API-feil");

            const data = await response.json();
            setResultat(data);
        } catch (error) {
            console.error("Klarte ikke hente data:", error);
            alert("Sjekk om FastAPI-serveren din kjører og er oppdatert!");
        } finally {
            setLaster(false);
        }
    };

    const getProgressBarColor = (prosent: number) => {
        if (prosent < 30) return "bg-green-500";
        if (prosent < 60) return "bg-yellow-500";
        if (prosent < 85) return "bg-orange-500";
        return "bg-red-600";
    };

    return (
        <main className='p-8 max-w-2xl mx-auto'>
            <h1 className='text-4xl font-extrabold mb-8 text-blue-900 tracking-tight'>
                Fiskesiden AI
            </h1>

            <div className='bg-white p-8 rounded-2xl border shadow-xl space-y-6'>
                <h2 className='text-xl font-semibold border-b pb-2 text-gray-700'>
                    Fagstanalyse
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* FISKETYPE & MÅNED */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Hva fisker du etter?
                        </label>
                        <select
                            value={fiskType}
                            onChange={(e) => setFiskType(e.target.value)}
                            className='w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                        >
                            {FISKE_TYPER.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Måned
                        </label>
                        <select
                            value={maaned}
                            onChange={(e) => setMaaned(Number(e.target.value))}
                            className='w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                        >
                            {MAANEDER.map((m) => (
                                <option key={m.nr} value={m.nr}>
                                    {m.navn}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* VEKT & DYP */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Anslått Vekt (kg)
                        </label>
                        <input
                            type='number'
                            step='0.5'
                            value={vekt}
                            onChange={(e) => setVekt(Number(e.target.value))}
                            className='w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Dyp (meter)
                        </label>
                        <input
                            type='number'
                            value={dyp}
                            onChange={(e) => setDyp(Number(e.target.value))}
                            className='w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                        />
                    </div>
                </div>

                {/* OMRÅDE & SLUK */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6'>
                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Område
                        </label>
                        <select
                            value={omraade}
                            onChange={(e) => setOmraade(e.target.value)}
                            className='w-full border-2 p-3 rounded-lg outline-none'
                        >
                            <option value='Austevoll'>Austevoll</option>
                            <option value='Krokeide'>Krokeide</option>
                            <option value='Lysefjorden'>Lysefjorden</option>
                            <option value='Blia'>Blia</option>
                            <option value='Frekhaug'>Frekhaug</option>
                            <option value='Sotra'>Sotra</option>
                            <option value='Askøy'>Askøy</option>
                        </select>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-600 uppercase'>
                            Sluk-valg
                        </label>
                        <select
                            value={sluk}
                            onChange={(e) => setSluk(e.target.value)}
                            className='w-full border-2 p-3 rounded-lg outline-none'
                        >
                            <option value='Møresilda'>Møresilda</option>
                            <option value='Stingsild'>Stingsild</option>
                            <option value='Sluk'>Generisk Sluk</option>
                            <option value='Flue'>Flue</option>
                            <option value='Jigg'>Jigg</option>
                            <option value='Rema-sluk'>Rema-sluk</option>
                            <option value='Fireball'>Fireball</option>
                            <option value='Wobbler'>Wobbler</option>
                            <option value='Spinner'>Spinner</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={analyserSituasjonen}
                    disabled={laster}
                    className='w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xl hover:bg-blue-700 shadow-lg transform active:scale-95 transition-all disabled:bg-gray-400 mt-4 uppercase tracking-widest'
                >
                    {laster ? "Kalkulerer..." : "Beregn sjanse for napp"}
                </button>

                {/* RESULTAT VISNING */}
                {resultat && (
                    <div className='mt-8 p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        <div className='flex justify-between items-end mb-2'>
                            <span className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                Risiko-analyse
                            </span>
                            <span
                                className={`text-4xl font-black ${getRiskColor(resultat.sjanse_for_at_den_slipper)} ${parseFloat(resultat.sjanse_for_at_den_slipper) > 80 ? "animate-pulse" : ""}`}
                            >
                                {resultat.sjanse_for_at_den_slipper}
                            </span>
                        </div>

                        <div className='w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner'>
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(parseFloat(resultat.sjanse_for_at_den_slipper))}`}
                                style={{
                                    width: resultat.sjanse_for_at_den_slipper,
                                }}
                            >
                                <div className='w-full h-full bg-white/20 opacity-50'></div>
                            </div>
                        </div>

                        <div className='flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase'>
                            <span>Trygg</span>
                            <span>Kritisk</span>
                        </div>

                        <div className='mt-6 pt-4 border-t border-dashed border-gray-200'>
                            <p className='text-blue-900 font-medium text-center italic leading-relaxed'>
                                &ldquo;{resultat.anbefaling}&rdquo;
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
