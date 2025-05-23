import React from 'react'
import { Login as LoginComponent } from '../components'

function Login() {
    return (
        <div className="min-h-[calc(100vh-80px)] py-16 md:py-32 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                        <LoginComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login