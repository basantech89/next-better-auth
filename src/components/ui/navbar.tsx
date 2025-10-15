'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { routes } from '@/utils/constants'

export const Logo = (props: React.SVGAttributes<SVGElement>) => {
	return (
		<svg
			fill="currentColor"
			height="1em"
			viewBox="0 0 324 323"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Logo</title>
			<rect
				fill="currentColor"
				height="36.5788"
				rx="18.2894"
				transform="rotate(-38.5799 88.1023 144.792)"
				width="151.802"
				x="88.1023"
				y="144.792"
			/>
			<rect
				fill="currentColor"
				height="36.5788"
				rx="18.2894"
				transform="rotate(-38.5799 85.3459 244.537)"
				width="151.802"
				x="85.3459"
				y="244.537"
			/>
		</svg>
	)
}

export const HamburgerIcon = ({
	className,
	...props
}: React.SVGAttributes<SVGElement>) => (
	<svg
		className={cn('pointer-events-none', className)}
		fill="none"
		height={16}
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		width={16}
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>Hamburger Icon</title>
		<path
			className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
			d="M4 12L20 12"
		/>
		<path
			className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
			d="M4 12H20"
		/>
		<path
			className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
			d="M4 12H20"
		/>
	</svg>
)

export interface NavbarNavLink {
	href: string
	label: string
	active?: boolean
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
	logo?: React.ReactNode
	logoHref?: string
	onCtaClick?: () => void
}

const navigationLinks: NavbarNavLink[] = [
	{ href: '/', label: 'Home', active: true },
	{ href: '#features', label: 'Features' },
	{ href: '#pricing', label: 'Pricing' },
	{ href: '#about', label: 'About' },
]

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
	(props, ref) => {
		const [isMobile, setIsMobile] = useState(false)
		const containerRef = useRef<HTMLElement>(null)

		const router = useRouter()
		const pathname = usePathname()

		const { data: session } = authClient.useSession()

		const handleAuthAction = async () => {
			if (session) {
				await authClient.signOut({
					fetchOptions: { onSuccess: () => router.push(routes.signIn) },
				})
			} else {
				router.push(pathname === routes.signIn ? routes.signUp : routes.signIn)
			}
		}

		useEffect(() => {
			const checkWidth = () => {
				if (containerRef.current) {
					const width = containerRef.current.offsetWidth
					setIsMobile(width < 768) // 768px is md breakpoint
				}
			}

			checkWidth()

			const resizeObserver = new ResizeObserver(checkWidth)
			if (containerRef.current) {
				resizeObserver.observe(containerRef.current)
			}

			return () => {
				resizeObserver.disconnect()
			}
		}, [])

		// Combine refs
		const combinedRef = React.useCallback(
			(node: HTMLElement | null) => {
				containerRef.current = node
				if (typeof ref === 'function') {
					ref(node)
				} else if (ref) {
					ref.current = node
				}
			},
			[ref],
		)

		return (
			<header
				className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6 [&_*]:no-underline"
				ref={combinedRef}
				{...props}
			>
				<div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						{isMobile && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
										size="icon"
										variant="ghost"
									>
										<HamburgerIcon />
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-48 p-2">
									<NavigationMenu className="max-w-none">
										<NavigationMenuList className="flex-col items-start gap-1">
											{navigationLinks.map((link, index) => (
												<NavigationMenuItem className="w-full" key={index}>
													<button
														className={cn(
															'flex w-full cursor-pointer items-center rounded-md px-3 py-2 font-medium text-sm no-underline transition-colors hover:bg-accent hover:text-accent-foreground',
															link.active
																? 'bg-accent text-accent-foreground'
																: 'text-foreground/80',
														)}
														onClick={e => e.preventDefault()}
													>
														{link.label}
													</button>
												</NavigationMenuItem>
											))}
										</NavigationMenuList>
									</NavigationMenu>
								</PopoverContent>
							</Popover>
						)}
						<div className="flex items-center gap-6">
							<button
								className="flex cursor-pointer items-center space-x-2 text-primary transition-colors hover:text-primary/90"
								onClick={e => e.preventDefault()}
							>
								<div className="text-2xl">
									<Logo />
								</div>
								<span className="hidden font-bold text-xl sm:inline-block">
									shadcn.io
								</span>
							</button>
							{!isMobile && (
								<NavigationMenu className="flex">
									<NavigationMenuList className="gap-1">
										{navigationLinks.map(link => (
											<NavigationMenuItem key={link.label}>
												<button
													className={cn(
														'group inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-md px-4 py-2 font-medium text-sm no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
														link.active
															? 'bg-accent text-accent-foreground'
															: 'text-foreground/80 hover:text-foreground',
													)}
													onClick={e => e.preventDefault()}
													type="button"
												>
													{link.label}
												</button>
											</NavigationMenuItem>
										))}
									</NavigationMenuList>
								</NavigationMenu>
							)}
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Button
							className="h-9 rounded-md px-4 font-medium text-sm shadow-sm"
							onClick={handleAuthAction}
							size="sm"
						>
							{session
								? 'Log Out'
								: pathname === routes.signIn
									? 'Sign Up'
									: 'Sign In'}
						</Button>
					</div>
				</div>
			</header>
		)
	},
)

Navbar.displayName = 'Navbar'
