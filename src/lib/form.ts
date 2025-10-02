import type React from 'react'

// Minimal form context facade for SubscribeButton
export function useFormContext() {
  return {
    Subscribe: ({
      selector,
      children,
    }: {
      selector: (state: { isSubmitting: boolean }) => boolean
      children: (value: boolean) => React.ReactNode
    }): React.ReactNode => {
      const selected = selector({ isSubmitting: false })
      return children(selected)
    },
  }
}
