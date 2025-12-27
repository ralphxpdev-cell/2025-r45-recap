import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

function App() {
  const [formData, setFormData] = useState({
    giftKeyword: '',
    message: '',
    thankYou: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('r45_recap_2025')
        .insert([
          {
            gift_keyword: formData.giftKeyword,
            message: formData.message,
            thank_you: formData.thankYou,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      setIsSubmitted(true)
      setFormData({ giftKeyword: '', message: '', thankYou: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="app">
        <div className="success-message">
          <h2>제출 완료!</h2>
          <p>소중한 의견 감사합니다.</p>
          <button onClick={() => setIsSubmitted(false)}>다시 작성하기</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <p className="hero-badge">R45 WORSHIP TEAM PRESENTS</p>
        <h1 className="hero-title">
          <span className="year">2025</span>
          <span className="r45">R45</span>
          RECAP
        </h1>
        <p className="hero-subtitle">THE AWARDS</p>
        <div className="hero-description">
          <p>2025 R45 RECAP 프로그램을 위한 사전 설문입니다.</p>
          <p>모든 응답은 익명으로 사용되며,</p>
          <p>일부 내용은 현장에서 소개될 수 있습니다.</p>
        </div>
      </section>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="form-container">
        {/* Gift Keyword Section */}
        <section className="form-section">
          <h2 className="section-title">YOUR GIFT KEYWORD</h2>
          <p className="section-description">
            준비한 선물을 가장 잘 표현하는 키워드와 물건을 적어주세요.
          </p>
          <p className="section-hint">예: 따뜻함 – 목도리 / 달콤함 – 초콜릿</p>
          <input
            type="text"
            value={formData.giftKeyword}
            onChange={(e) => setFormData({ ...formData, giftKeyword: e.target.value })}
            placeholder="키워드 - 물건"
            className="form-input"
            required
          />
        </section>

        {/* Message Section */}
        <section className="form-section">
          <h2 className="section-title">A MESSAGE</h2>
          <p className="section-description">
            이 선물을 받게 될 분에게 전하고 싶은 따뜻한 한마디를 남겨주세요.
          </p>
          <p className="section-hint">이름은 적지 않아도 됩니다.</p>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="메시지를 입력하세요"
            className="form-textarea"
            rows={5}
            required
          />
        </section>

        {/* Thank You Section */}
        <section className="form-section">
          <h2 className="section-title">THANK YOU</h2>
          <p className="section-description">
            2025년, 예배팀 안에서 가장 고마웠던 사람은 누구인가요?
          </p>
          <p className="section-hint">이유가 있다면 한 줄로 함께 적어주세요.</p>
          <textarea
            value={formData.thankYou}
            onChange={(e) => setFormData({ ...formData, thankYou: e.target.value })}
            placeholder="이름과 이유를 입력하세요"
            className="form-textarea"
            rows={5}
            required
          />
        </section>

        {/* Submit Button */}
        <div className="submit-container">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
