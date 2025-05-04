import styled, { css } from "styled-components"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const buttonVariantStyles = {
  default: css`
    background-color: #FF7300;
    color: white;
    &:hover {
      background-color: #E65A00;
    }
  `,
  destructive: css`
    background-color: #EF4444;
    color: white;
    &:hover {
      background-color: #DC2626;
    }
  `,
  outline: css`
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: transparent;
    color: #E5E7EB;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  `,
  secondary: css`
    background-color: #374151;
    color: white;
    &:hover {
      background-color: #4B5563;
    }
  `,
  ghost: css`
    background-color: transparent;
    color: #E5E7EB;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  `,
  link: css`
    background-color: transparent;
    color: #FF7300;
    text-decoration: underline;
    text-underline-offset: 4px;
    &:hover {
      text-decoration: none;
    }
  `,
}

const buttonSizeStyles = {
  default: css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  `,
  sm: css`
    height: 2.25rem;
    padding: 0 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.375rem;
  `,
  lg: css`
    height: 2.75rem;
    padding: 0 2rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
  `,
  icon: css`
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
}

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  
  &:focus-visible {
    outline: 2px solid #FF7300;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${(props) => buttonVariantStyles[props.$variant]}
  ${(props) => buttonSizeStyles[props.$size]}
`

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return <StyledButton $variant={variant} $size={size} ref={ref} {...props} />
  },
)

Button.displayName = "Button"

export { Button }
