import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    giftKeyword: '',
    message: '',
    thankYou: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // 카운트다운 타이머
  useEffect(() => {
    if (!isSubmitted) return

    const targetDate = new Date('2025-12-28T17:30:00+09:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('r45_recap_2025')
        .upsert([
          {
            name: formData.name,
            gift_keyword: formData.giftKeyword,
            message: formData.message,
            thank_you: formData.thankYou,
            updated_at: new Date().toISOString()
          }
        ], {
          onConflict: 'name'
        })

      if (error) throw error

      setIsSubmitted(true)
      setFormData({ name: '', giftKeyword: '', message: '', thankYou: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-r45-black text-r45-white relative">
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
          <h2 className="font-bebas text-3xl md:text-5xl lg:text-6xl tracking-super-wide mb-6 text-r45-white">
            제출이 완료되었습니다
          </h2>
          <p className="text-2xl md:text-3xl mb-16 gradient-r45">
            2025 R45 RECAP 에서 만나요 😊
          </p>

          {/* Countdown Timer */}
          <div className="mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3 text-5xl md:text-6xl lg:text-7xl font-bebas">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-r45-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-r45-white">
                {String(timeLeft.days).padStart(2, '0')}일{' '}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-2 text-lg md:text-xl text-r45-gray">
              <p className="flex items-center justify-center gap-2">
                <span>📅</span>
                <span>2025년 12월 28일 토요일</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <span>⏰</span>
                <span>저녁 17:30</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <span>📍</span>
                <span>쿵푸짬뽕</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitted(false)}
            className="font-bebas text-base tracking-super-wide px-12 py-4 bg-transparent text-r45-white border-2 border-r45-white cursor-pointer transition-all duration-300 hover:bg-r45-white hover:text-r45-black"
          >
            다시 작성하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-r45-black text-r45-white relative">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center p-8 relative">
        <p className="font-bebas text-base tracking-ultra-wide text-r45-gray mb-8">
          R45 WORSHIP TEAM PRESENTS
        </p>
        <h1 className="font-bebas text-7xl md:text-9xl lg:text-[12rem] leading-[0.9]">
          <span className="block text-[0.35em] tracking-ultra-wide text-r45-gray mb-2">
            2025
          </span>
          <span className="block gradient-r45">
            R45
          </span>
          RECAP
        </h1>
        <p className="font-bebas text-xl md:text-2xl lg:text-4xl tracking-extra-wide mt-6 text-r45-white">
          THE AWARDS
        </p>
        <div className="mt-12 text-sm md:text-base text-r45-gray leading-relaxed">
          <p>2025 R45 RECAP 프로그램을 위한 사전 설문입니다.</p>
          <p>모든 응답은 익명으로 사용되며,</p>
          <p>일부 내용은 현장에서 소개될 수 있습니다.</p>
        </div>
      </section>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-8 py-16 pb-24">
        {/* Name Section */}
        <section className="mb-16 pb-16 border-b border-r45-gray/20">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-super-wide mb-6 text-r45-white">
            YOUR NAME
          </h2>
          <p className="text-base leading-relaxed mb-2 text-r45-white font-light">
            당신의 이름을 알려주세요.
          </p>
          <p className="text-sm text-r45-gray mb-8">
            같은 이름으로 재제출 시 이전 답변이 수정됩니다.
          </p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="이름을 입력하세요"
            className="w-full bg-transparent border border-r45-gray/30 text-r45-white px-6 py-4 font-noto text-base rounded-none transition-all duration-300 focus:outline-none focus:border-r45-green focus:shadow-[0_0_0_1px] focus:shadow-r45-green placeholder:text-r45-gray/50"
            required
          />
        </section>

        {/* Gift Keyword Section */}
        <section className="mb-16 pb-16 border-b border-r45-gray/20">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-super-wide mb-6 text-r45-white">
            YOUR GIFT KEYWORD
          </h2>
          <p className="text-base leading-relaxed mb-2 text-r45-white font-light">
            준비한 선물을 가장 잘 표현하는 키워드와 물건을 적어주세요.
          </p>
          <p className="text-sm text-r45-gray mb-8">
            예: 따뜻함 – 목도리 / 달콤함 – 초콜릿
          </p>
          <input
            type="text"
            value={formData.giftKeyword}
            onChange={(e) => setFormData({ ...formData, giftKeyword: e.target.value })}
            placeholder="키워드 - 물건"
            className="w-full bg-transparent border border-r45-gray/30 text-r45-white px-6 py-4 font-noto text-base rounded-none transition-all duration-300 focus:outline-none focus:border-r45-green focus:shadow-[0_0_0_1px] focus:shadow-r45-green placeholder:text-r45-gray/50"
            required
          />
        </section>

        {/* Message Section */}
        <section className="mb-16 pb-16 border-b border-r45-gray/20">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-super-wide mb-6 text-r45-white">
            A MESSAGE
          </h2>
          <p className="text-base leading-relaxed mb-2 text-r45-white font-light">
            이 선물을 받게 될 분에게 전하고 싶은 따뜻한 한마디를 남겨주세요.
          </p>
          <p className="text-sm text-r45-gray mb-8">
            이름은 적지 않아도 됩니다.
          </p>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="메시지를 입력하세요"
            className="w-full bg-transparent border border-r45-gray/30 text-r45-white px-6 py-4 font-noto text-base rounded-none transition-all duration-300 focus:outline-none focus:border-r45-green focus:shadow-[0_0_0_1px] focus:shadow-r45-green placeholder:text-r45-gray/50 resize-vertical min-h-[150px] leading-relaxed"
            rows={5}
            required
          />
        </section>

        {/* Thank You Section */}
        <section className="mb-16 pb-16">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-super-wide mb-6 text-r45-white">
            THANK YOU
          </h2>
          <p className="text-base leading-relaxed mb-2 text-r45-white font-light">
            2025년, 예배팀 안에서 가장 고마웠던 사람은 누구인가요?
          </p>
          <p className="text-sm text-r45-gray mb-8">
            이유가 있다면 한 줄로 함께 적어주세요.
          </p>
          <textarea
            value={formData.thankYou}
            onChange={(e) => setFormData({ ...formData, thankYou: e.target.value })}
            placeholder="이름과 이유를 입력하세요"
            className="w-full bg-transparent border border-r45-gray/30 text-r45-white px-6 py-4 font-noto text-base rounded-none transition-all duration-300 focus:outline-none focus:border-r45-green focus:shadow-[0_0_0_1px] focus:shadow-r45-green placeholder:text-r45-gray/50 resize-vertical min-h-[150px] leading-relaxed"
            rows={5}
            required
          />
        </section>

        {/* Submit Button */}
        <div className="flex justify-center mt-16">
          <button
            type="submit"
            className="font-bebas text-lg md:text-xl tracking-super-wide px-12 md:px-16 py-5 bg-transparent text-r45-white border-2 border-r45-white cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-r45-white hover:text-r45-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
