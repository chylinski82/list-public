const Comments = ({ colorPicker, tile, handleChangeComments }) => {

    return ( 
            <textarea className={colorPicker()}
                      placeholder="comments and links"
                      value={tile.comments}
                      onChange={(e) => handleChangeComments(e.target.value)}></textarea>
    );  
}
 
export default Comments;
