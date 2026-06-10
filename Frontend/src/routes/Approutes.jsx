import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Notes from '../pages/Notes'
import Topics from '../pages/Topics'
import Patterns from '../pages/Patterns'
import Profile from '../pages/Profile'
import Progress from '../pages/Progress'
import Bookmarks from '../pages/Bookmarks'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import NotFound from '../pages/NotFound'
import Question from '../pages/Question'

import MainLayout from '../layout/MainLayout'
import Settings from '../pages/Settings'
import Dashboard from '../pages/Dashboard'
import SolvedQuestions from '../pages/SolvedQuestions'
import RevisionPage from '../pages/RevisionPage'
import ForgotPassword from '../pages/ForgotPassword '
import PublicProfile from '../component/PublicProfile '
import Support from "../pages/Support"
import MyTickets from '../pages/MyTickets'
import TicketDetails from '../pages/TicketDetails'
import AdminTickets from '../pages/AdminTickets'
import AdminTicketDetails from '../pages/AdminTicketDetails '
const Approutes = () => {

    return (

        <Routes>

            {/* Layout Routes */}

            <Route element={<MainLayout />}>

                <Route path='/' element={<Home />} />

                <Route path='/notes' element={<Notes />} />

                <Route path='/topics' element={<Topics />} />
                <Route path='/settings' element={<Settings />} />

                {/* Updated Route */}

                <Route
                    path='/patterns/:topicId'
                    element={<Patterns />}
                />

                <Route
                    path='/questions/:patternId'
                    element={<Question />}
                />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path='/bookmarks' element={<Bookmarks />} />

                <Route path='/profile' element={<Profile />} />
                <Route path='/u/:username' element={<PublicProfile />} />

                <Route path='/progress' element={<Progress />} />
                <Route path='/solved' element={<SolvedQuestions />} />
                <Route path="/revision/due" element={<RevisionPage />} />
                <Route path="/support" element={<Support />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/ticket/:id" element={<TicketDetails />} />
                <Route  path="/admin/tickets" element={<AdminTickets />} />
                <Route  path="/admin/tickets/:id" element={<AdminTicketDetails/>} />

            </Route>

            {/* Auth Routes */}

            <Route path='/login' element={<Login />} />
            <Route path='/reset-password' element={<ForgotPassword />} />

            <Route path='/signup' element={<Signup />} />

            {/* Not Found */}

            <Route path='*' element={<NotFound />} />

        </Routes>

    )

}

export default Approutes