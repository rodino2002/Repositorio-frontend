/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flyonui/dist/js/*.js",
    
  ],
  theme: {
  	extend: {
  		keyframes: {
  			wobble: {
  				from: {
  					transform: 'translate3d(0, 0, 0)'
  				},
  				'15%': {
  					transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)'
  				},
  				'30%': {
  					transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)'
  				},
  				'45%': {
  					transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)'
  				},
  				'60%': {
  					transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)'
  				},
  				'75%': {
  					transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)'
  				},
  				to: {
  					transform: 'translate3d(0, 0, 0)'
  				}
  			},
  			fadeIn: {
  				from: {
  					opacity: 0
  				},
  				to: {
  					opacity: 5
  				}
  			},
  			fadeOut: {
  				from: {
  					opacity: 5
  				},
  				to: {
  					opacity: 0
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn .5s ease-in-out',
  			fadeInDown: 'fadeInDown .5s ease-in-out',
  			bounce: 'bounce 1s linear infinite',
  			spin: 'spin 1s linear infinite'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
 

  plugins: [
      require("tailwindcss-animate")
],
// ...
sidebar: {
	DEFAULT: 'hsl(var(--sidebar-background))',
	foreground: 'hsl(var(--sidebar-foreground))',
	primary: 'hsl(var(--sidebar-primary))',
	'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
	accent: 'hsl(var(--sidebar-accent))',
	'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
	border: 'hsl(var(--sidebar-border))',
	ring: 'hsl(var(--sidebar-ring))',
  },
  // ...
  
}
