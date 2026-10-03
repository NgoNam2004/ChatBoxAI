// Tiny helper for combining conditional class names without extra deps.
// Usage: cn('base', condition && 'extra', another ? 'a' : 'b')
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
