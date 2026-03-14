
import React, { useState, useMemo, useEffect } from 'react';
import { Category, CalculatorState, Rule } from './types';
import { RULES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    category: '',
    subCategory: '',
    rank: '',
    count: '',
    birthYear: '',
    recency: '',
  });

  const [finalScore, setFinalScore] = useState<number | null>(null);

  // Filter options based on previous selections
  const filteredRulesByCategory = useMemo(() => {
    return RULES.filter(r => r.category === state.category);
  }, [state.category]);

  const subCategoryOptions = useMemo(() => {
    const subs = filteredRulesByCategory
      .map(r => r.subCategory)
      .filter((s): s is string => !!s);
    return Array.from(new Set(subs));
  }, [filteredRulesByCategory]);

  const filteredRulesBySub = useMemo(() => {
    if (subCategoryOptions.length > 0 && !state.subCategory) return [];
    return filteredRulesByCategory.filter(r => !r.subCategory || r.subCategory === state.subCategory);
  }, [filteredRulesByCategory, state.subCategory, subCategoryOptions]);

  const rankOptions = useMemo(() => {
    return Array.from(new Set(filteredRulesBySub.map(r => r.rank)));
  }, [filteredRulesBySub]);

  const filteredRulesByRank = useMemo(() => {
    return filteredRulesBySub.filter(r => r.rank === state.rank);
  }, [filteredRulesBySub, state.rank]);

  const countOptions = useMemo(() => {
    return Array.from(new Set(filteredRulesByRank.map(r => r.count)));
  }, [filteredRulesByRank]);

  const filteredRulesByCount = useMemo(() => {
    return filteredRulesByRank.filter(r => r.count === state.count);
  }, [filteredRulesByRank, state.count]);

  const birthYearOptions = useMemo(() => {
    return Array.from(new Set(filteredRulesByCount.map(r => r.birthYear)));
  }, [filteredRulesByCount]);

  const filteredRulesByBirth = useMemo(() => {
    return filteredRulesByCount.filter(r => r.birthYear === state.birthYear);
  }, [filteredRulesByCount, state.birthYear]);

  const recencyOptions = useMemo(() => {
    return Array.from(new Set(filteredRulesByBirth.map(r => r.recency)));
  }, [filteredRulesByBirth]);

  // Handle Score Calculation
  useEffect(() => {
    const match = filteredRulesByBirth.find(r => r.recency === state.recency);
    if (match) {
      setFinalScore(match.score);
    } else {
      setFinalScore(null);
    }
  }, [state, filteredRulesByBirth]);

  const handleReset = () => {
    setState({
      category: '',
      subCategory: '',
      rank: '',
      count: '',
      birthYear: '',
      recency: '',
    });
    setFinalScore(null);
  };

  const SelectionRow = ({ label, value, options, field }: { label: string, value: string, options: string[], field: keyof CalculatorState }) => {
    if (options.length === 0) return null;
    
    // Auto-select if only one option (and not already selected)
    useEffect(() => {
      if (options.length === 1 && value !== options[0]) {
        setState(prev => ({ ...prev, [field]: options[0] }));
      }
    }, [options, value, field]);

    return (
      <div className="mb-6 animate-fadeIn">
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setState(prev => ({ ...prev, [field]: opt }))}
              className={`px-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 text-left flex justify-between items-center ${
                value === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>{opt}</span>
              {value === opt && (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 px-4 md:px-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-8 pb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">양주시테니스협회</h1>
        <p className="text-lg font-medium text-slate-700 uppercase tracking-widest">점수 계산기(2026년. Version 1.1_20260315)</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
          {/* Category Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-slate-100 rounded-full inline-flex items-center justify-center mr-2 text-xs text-slate-500">1</span>
              대회 부문을 선택해주세요
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    handleReset();
                    setState(prev => ({ ...prev, category: cat }));
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                    state.category === cat
                      ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50'
                      : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'
                  }`}
                >
                  <div className="relative z-10 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 transition-colors ${state.category === cat ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                    <span className={`text-sm font-semibold ${state.category === cat ? 'text-blue-900' : 'text-slate-600'}`}>
                      {cat}
                    </span>
                  </div>
                  {state.category === cat && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {state.category && (
            <div className="space-y-6 pt-6 border-t border-slate-100 animate-slideUp">
              {subCategoryOptions.length > 0 && (
                <SelectionRow 
                  label="세부 구분 (대진 규모)" 
                  value={state.subCategory} 
                  options={subCategoryOptions} 
                  field="subCategory" 
                />
              )}
              
              <SelectionRow 
                label="입상 순위" 
                value={state.rank} 
                options={rankOptions} 
                field="rank" 
              />
              
              <SelectionRow 
                label="입상 횟수" 
                value={state.count} 
                options={countOptions} 
                field="count" 
              />

              <SelectionRow 
                label="출생 연도" 
                value={state.birthYear} 
                options={birthYearOptions} 
                field="birthYear" 
              />

              <SelectionRow 
                label="최근 입상 시기" 
                value={state.recency} 
                options={recencyOptions} 
                field="recency" 
              />
            </div>
          )}

          {/* Result Area */}
          <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center min-h-[200px] transition-all duration-500 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
                  <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
             </div>

             {finalScore !== null ? (
               <div className="text-center animate-bounceIn z-10">
                 <p className="text-slate-400 font-medium mb-1 tracking-wider uppercase text-xs">최종 환산 점수</p>
                 <div className="flex items-baseline justify-center">
                    <span className="text-7xl font-black text-white">{finalScore}</span>
                    <span className="text-2xl font-bold text-slate-400 ml-2">점</span>
                 </div>
                 <div className="mt-6 flex gap-3 justify-center">
                   <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors border border-white/10"
                   >
                     다시 계산하기
                   </button>
                 </div>
               </div>
             ) : (
               <div className="text-center opacity-60 px-6 z-10">
                 <p className="text-lg font-medium leading-relaxed">
                   위의 항목을 모두 선택하면<br/>
                   <span className="text-blue-400">환산 점수</span>가 나타납니다.
                 </p>
               </div>
             )}
          </div>
        </div>

        {/* Info/Rules Section */}
        <div className="mt-10 px-4">
           <details className="group">
              <summary className="list-none flex items-center justify-between cursor-pointer p-4 rounded-2xl bg-slate-200/50 hover:bg-slate-200 transition-colors">
                <span className="text-sm font-bold text-slate-700 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  점수 산정 기준 안내
                </span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-3 shadow-sm">
                <p>• 본 계산기는 양주시테니스협회의 점수 등급표를 기준으로 제작되었습니다.</p>
                <p>• 전국대회(랭킹)은 3대 기구(KTA, KATA, KATO) 주최 대회를 의미합니다.</p>
                <p>• 중복 입상의 경우 포인트가 더 높은 성적 하나만 본인의 포인트로 인정됩니다. </p>
                <p>• 대회 등급(전국/지역) 및 연령대(1969년 이후/1968년 이전), 입상 시기 경과 여부에 따라 점수가 차등 적용됩니다.</p>
                <p>• 입상 시기 산정: 전국대회(7년), 지역대회(5년) 기준</p>
                <div className="pt-2 border-t border-slate-100 text-slate-400 text-xs text-center">
                  Copyright © 2026 Yangju Tennis Association.
                </div>
              </div>
           </details>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
