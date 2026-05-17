import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fade/slide-in sections when they enter the viewport.
 * Targets direct children of `main` (section/div) plus sitewide `footer`.
 */
export function useScrollRevealLayout() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const main = document.querySelector('main')
    const footerEl = document.querySelector('footer')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /** @type {Element[]} */
    const targets = []

    if (main) {
      for (const node of main.children) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue
        const tag = node.tagName.toLowerCase()
        if (tag === 'section' || tag === 'div') targets.push(node)
      }
    }
    if (footerEl) targets.push(footerEl)

    if (!targets.length) return () => {}

    targets.forEach((el) => {
      el.classList.remove('scroll-reveal-on', 'scroll-reveal-off')
      el.classList.add('scroll-reveal-target')
    })

    if (reducedMotion) {
      targets.forEach((el) => {
        el.classList.add('scroll-reveal-on')
        gsap.set(el, { clearProps: 'all' })
        gsap.set(el.children, { clearProps: 'all' })
      })
      return () => {}
    }

    const ctx = gsap.context(() => {
      targets.forEach((el, index) => {
        const children = Array.from(el.children ?? [])
        gsap.set(el, { autoAlpha: 0, y: 28, scale: 0.995 })
        gsap.set(children, { autoAlpha: 0, y: 14 })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            once: true,
          },
        })

        timeline.call(() => {
          el.classList.remove('scroll-reveal-off')
          el.classList.add('scroll-reveal-on')
        })
        timeline.to(
          el,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power3.out',
          },
          index * 0.02,
        )
        if (children.length) {
          timeline.to(
            children,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
            },
            index * 0.02 + 0.12,
          )
        }
      })

      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [pathname])
}
