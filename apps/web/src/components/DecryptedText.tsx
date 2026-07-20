/**
 * DecryptedText — ported from React Bits (reactbits.dev/text-animations/decrypted-text)
 * Characters scramble through a charset before resolving left-to-right.
 */
import { useState, useEffect, useRef, useCallback } from 'react'

interface DecryptedTextProps {
  text: string
  /** ms per scramble frame */
  speed?: number
  /** scramble frames before each character resolves */
  maxIterations?: number
  /** reveal left-to-right (true) or all-at-once (false) */
  sequential?: boolean
  /** charset used for scrambling */
  characters?: string
  /** className applied to resolved characters */
  className?: string
  /** wrapper span className */
  parentClassName?: string
  /** className applied to still-scrambling characters */
  encryptedClassName?: string
  /** what triggers the animation */
  animateOn?: 'hover' | 'view' | 'manual'
  /** when animateOn='manual', set to true to fire */
  trigger?: boolean
  onAnimationComplete?: () => void
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  sequential = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*-+=|/\\<>[]{}',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  trigger,
  onAnimationComplete,
}: DecryptedTextProps) {
  // For 'manual' mode: start hidden — no text until trigger fires.
  // For other modes: show real text immediately (hover/view handle their own timing).
  const [displayText, setDisplayText] = useState<string[]>(
    animateOn === 'manual' ? [] : text.split('')
  )
  const [isAnimating, setIsAnimating] = useState(false)

  const iterCount   = useRef(0)
  const revealed    = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const parentRef   = useRef<HTMLSpanElement>(null)

  const randomChar = useCallback(
    () => characters[Math.floor(Math.random() * characters.length)],
    [characters]
  )

  const startAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    iterCount.current = 0
    revealed.current  = 0

    // Immediately fill with scrambled chars so there's no blank→text flash
    setDisplayText(
      text.split('').map((char) => (char === ' ' ? ' ' : randomChar()))
    )

    intervalRef.current = setInterval(() => {
      if (sequential) {
        setDisplayText(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < revealed.current) return char
            return randomChar()
          })
        )

        iterCount.current++
        if (iterCount.current >= maxIterations) {
          iterCount.current = 0
          revealed.current++

          if (revealed.current > text.length) {
            clearInterval(intervalRef.current!)
            setDisplayText(text.split(''))
            setIsAnimating(false)
            onAnimationComplete?.()
          }
        }
      } else {
        iterCount.current++
        if (iterCount.current >= maxIterations) {
          clearInterval(intervalRef.current!)
          setDisplayText(text.split(''))
          setIsAnimating(false)
          onAnimationComplete?.()
        } else {
          setDisplayText(
            text.split('').map((char) => (char === ' ' ? ' ' : randomChar()))
          )
        }
      }
    }, speed)
  }, [isAnimating, text, sequential, maxIterations, speed, randomChar, onAnimationComplete])

  // manual trigger
  useEffect(() => {
    if (animateOn === 'manual' && trigger === true) {
      startAnimation()
    }
  }, [trigger]) // eslint-disable-line react-hooks/exhaustive-deps

  // view trigger
  useEffect(() => {
    if (animateOn !== 'view') return
    const el = parentRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { startAnimation(); obs.disconnect() }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [animateOn]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = () => {
    if (animateOn === 'hover') startAnimation()
  }

  // reset when text prop changes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplayText(animateOn === 'manual' ? [] : text.split(''))
    setIsAnimating(false)
    iterCount.current = 0
    revealed.current  = 0
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <span
      ref={parentRef}
      className={parentClassName}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {displayText.length === 0
        // Invisible placeholder — keeps layout height stable while waiting for trigger
        ? <span style={{ opacity: 0, userSelect: 'none' }} aria-hidden="true">{text}</span>
        : displayText.map((char, i) => (
            <span
              key={i}
              className={char === text[i] || char === ' ' ? className : encryptedClassName}
            >
              {char}
            </span>
          ))
      }
    </span>
  )
}
