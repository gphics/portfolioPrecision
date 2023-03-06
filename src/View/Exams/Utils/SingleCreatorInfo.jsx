export default function CreatorInf({ user_img_name, email, fullname, contact, username, location }) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/user/folder/${user_img_name}`
    return <section id="singleExamCreatorInfo" className='flexColumn' >
        <img src={imgUrl} alt={fullname} />
        <div className="examCreatorRestInfo flexRow">
            <h4>fullname:</h4>
            <h4> {fullname && fullname.length > 30 ? fullname.slice(0, 30) : fullname} </h4>
        </div>

        <div className="examCreatorRestInfo flexRow">
            <h4>username:</h4>
            <h4> {username} </h4>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4 style={{ textTransform: 'none' }}>email:</h4>
            <h4 style={{ textTransform: 'none' }}> {email} </h4>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4>contact:</h4>
            <h4> 0{contact} </h4>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4>location:</h4>
            <h4> {location} </h4>
        </div>
    </section>
}

