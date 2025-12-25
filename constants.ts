
import { Service, ServiceStatus } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: 'SRV-001',
    title: 'Limpeza Residencial Completa',
    category: 'Limpeza & Organização',
    price: 150,
    status: ServiceStatus.ACTIVE,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ19JrR7WWKjnmsD6yIEgFif25mSoA_YFNQ9_USvNEcndsHxnMjPsV0OgJ6xB8Clyxql4ksOkrKzXiBkQ7QjwGmH7zIgTRATQ3D3mfvYDdvd9F6hAAX_pQl6Db8blGd99a_h3Zh7pwVIALC0rTi5QdP1xtL_dyeS22rEESBC7zoEHlPU3GHSlxvUxqCtVqNsyfc89FRD6OuU6abtNyNE4IB1hXBbke6JvSgF3FZWudGRHUlYk0m2VLa4X3hLH4VEzHN-CEkahfjSGg',
    description: 'Limpeza profunda para apartamentos e casas de até 100m². Inclui todos os materiais.',
    location: 'São Paulo, SP',
    rating: 4.9,
    reviewsCount: 120,
    provider: {
      name: 'Maria Silva',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEAO421U2s37pfv9bOpXQ1oJm7YzcFD3nOAvEkhEyYK6cXk-0e53iVwp9HS6Nn87qs4zstaGVOonOXp0c1Qnq5qIlsp-lmaiVpBo537hNTr80CRHzmqVKwrq1EQDmNQtGw7c7ZknrfIt3kibAXkmiebZIIPhHJFrM5QyKdXyxxGenFAYf107_A6gTtfpCB6D_icD42Q1pHjqupBkz_zDk-0V-uImNBWwlEClaZY0lTtd-XGnWkz5CsHL7W-6UwW4FRe6ZS8XHXCa_w',
      verified: true,
      status: 'Online agora'
    }
  },
  {
    id: 'SRV-002',
    title: 'Montagem de Móveis',
    category: 'Marido de Aluguel',
    price: 80,
    status: ServiceStatus.ACTIVE,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnBm-FuVJFo-qY9_JwmTpybQI9aZrwYgiBmbmf9h5JB1YHLrp2RMOIHkwU-QiJS6ZwwPKvA7Ea3_7QIGbRNsrjJ-zP04G4Ns43QTjgAkFxiveu1cTZWyENi4AgBRy5Z8MKCuBHn3oT5rnbMy13bQ27gm4PPTMWlAbRfQmg8rdSfCP3GIbrpMW8TVn9JMpjpsiHvxKtt0o5uoH6szHARiMV2kzTX5fQkj7irytNyXuF2_CnmcPUFIx_iimWPbXb_v_RuxdiTLcle_OF',
    description: 'Montagem profissional de móveis de qualquer marca. Ferramentas próprias e rapidez.',
    location: 'São Paulo, SP',
    rating: 5.0,
    reviewsCount: 45,
    provider: {
      name: 'João Pereira',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoPlBt8npEkXwQ55AJ5-HONankkunkN69vE3GNC65AyJ9ZwwCEWNPWQVHhwK_FsRAzQb8JQn5PB-Vs1ZGE7TvID9-Zz80sdZrGhTA-5sh4wF5Rj6Y-DyKm2b9YBKhfc0Q-iO-ZbjzLsnpMKa2I2IfBNat8TU82guDP7e64j1FjwiwwKaKwfCG4wH8Exe1SdETK9JR0zn76b7Di8SzpK6ru18olCrD-sCJup6VoZjWa9GeXUNELNEv2ShBKERvxg4EG7tbMNaUYbt8W',
      verified: true
    }
  },
  {
    id: 'SRV-003',
    title: 'Jardinagem Simples',
    category: 'Jardinagem',
    price: 100,
    status: ServiceStatus.INACTIVE,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG2iHkp5OymwOSoP8QoPnMTiUf_GSfbUCwiKRz37K0oWWRCeTEW8crNj_6x3OJra1OP72MsgS2DT-uwpCzoImkNPotlSHTwLHgsf_7YqOegK8yzppis3JKOA1xEgKjLlSiNSknpbKRy7GD4rE-5ourVWDEjOZCDG9D80a8KAm2jtPX6x67X6nBaqCGKmTtDRKO6iZiXwcBzF5NVjEThRFe2KatMs8Rob_6fhvoV8uhSq_A87TuwKF4i_-FzNx6yKbcLioy7-gO42By',
    description: 'Manutenção de jardins, poda de grama e limpeza de folhas.',
    location: 'São Paulo, SP',
    rating: 4.5,
    reviewsCount: 12,
    provider: {
      name: 'Carlos Tech',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0zISnXWdgdgirsMvENDAjeO0iQcjwt6OZyrnq1AE1qShAl2MWP0EOgOGWnZl4OqFa0NuTsSeC6CiZliPzsXU-H9CcKGAA2_Sjt_eSZMCrMdxRt3eEV_tzykN03c6h90RiLt5_FwSP7-NnrNJyhzuxWnL4B9OmVIoOWQUnq1-YqTeVGWG44fPv6eFonAeFrWSCwOcddK1gRmFqKigH0-QVbIdP0uYXDZlUwXyXyInWX31FghGAXtqPhaeerGgBowWUrFl6yjNSW1se',
      verified: false
    }
  }
];
