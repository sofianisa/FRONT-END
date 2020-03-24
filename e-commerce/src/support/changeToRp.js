import Numeral from 'numeral'
export const changetoRupiah=(a)=>{
    return 'Rp.'+Numeral(a).format('0,0')
}   