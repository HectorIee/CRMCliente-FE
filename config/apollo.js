import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://crmgraphql-be-production.up.railway.app/'
})

const authLink = setContext((_, { headers }) => {

    // Read the stored storaged
    const token = localStorage.getItem('token')

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

export default client;