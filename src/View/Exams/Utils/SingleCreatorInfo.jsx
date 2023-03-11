export default function CreatorInf({ user_img_name, email, fullname, contact, username, location }) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/user/folder/${user_img_name}`
    return <section id="singleExamCreatorInfo" className='flexColumn' >
        <img src={imgUrl} alt={fullname} />
        <div className="examCreatorRestInfo flexRow">
            <h4>fullname:</h4>
            <h5> {fullname && fullname.length > 30 ? fullname.slice(0, 30) : fullname} </h5>
        </div>

        <div className="examCreatorRestInfo flexRow">
            <h4>username:</h4>
            <h5> {username} </h5>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4 style={{ textTransform: 'none' }}>email:</h4>
            <h5 style={{ textTransform: 'none' }}> {email} </h5>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4>contact:</h4>
            <h5> 0{contact} </h5>
        </div>
        <div className="examCreatorRestInfo flexRow">
            <h4>location:</h4>
            <h5> {location} </h5>
        </div>
    </section>
}

